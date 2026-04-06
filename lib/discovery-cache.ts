import type { MomentResult } from './search/types'

// Signed URLs last 1 hour — cache for 45 min to stay safe
const TTL_MS = 45 * 60 * 1000

const key = (query: string) => `pf:discovery:${query}`

export function getCachedResults(query: string): MomentResult[] | null {
  try {
    const raw = localStorage.getItem(key(query))
    if (!raw) return null
    const { results, cachedAt } = JSON.parse(raw) as { results: MomentResult[]; cachedAt: number }
    if (Date.now() - cachedAt > TTL_MS) {
      localStorage.removeItem(key(query))
      return null
    }
    return results
  } catch {
    return null
  }
}

export function setCachedResults(query: string, results: MomentResult[]) {
  try {
    localStorage.setItem(key(query), JSON.stringify({ results, cachedAt: Date.now() }))
  } catch {
    // localStorage unavailable or full — fail silently
  }
}

export async function fetchAndCache(query: string): Promise<MomentResult[] | null> {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return null
    const results: MomentResult[] = await res.json()
    setCachedResults(query, results)
    return results
  } catch {
    return null
  }
}
