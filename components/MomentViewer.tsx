'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VideoPlayer from './VideoPlayer'
import type { MomentResult } from '@/lib/search/types'
import { getCachedResults, fetchAndCache } from '@/lib/discovery-cache'

const DISCOVERY_ROWS = [
  'how do I stop procrastinating every day',
  'business ideas with low startup costs',
  'habits that actually improve sleep',
  'how to get better at sales',
  'what makes people more productive',
  'how to build discipline without burnout',
  'money mistakes people make in their 20s',
  'how to hire your first great employee',
  'ways to communicate with more confidence',
  'what successful people do differently',
  'how to make content people actually share',
  'systems for staying focused all day',
]

// Subtle shade variations so each card looks distinct
const CARD_SHADES = [
  'bg-[oklch(0.88_0.015_75)]',
  'bg-[oklch(0.85_0.010_186)]',
  'bg-[oklch(0.87_0.012_150)]',
  'bg-[oklch(0.86_0.018_30)]',
  'bg-[oklch(0.89_0.008_280)]',
]

function PlaceholderCard({ shade }: { shade: string }) {
  return (
    <div className={`flex-1 rounded-xl overflow-hidden ${shade} border border-border/50`} style={{ aspectRatio: '9/16' }}>
      <div className="relative w-full h-full flex flex-col justify-end p-2">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* fake play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="h-3.5 w-3.5 ml-0.5 text-white/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* fake text lines */}
        <div className="relative flex flex-col gap-1 z-10">
          <div className="h-1.5 w-10 rounded bg-white/30" />
          <div className="h-1.5 w-16 rounded bg-white/20" />
        </div>
      </div>
    </div>
  )
}

function DiscoveryState() {
  const router = useRouter()
  // Map of query → cached results (populated progressively)
  const [cache, setCache] = useState<Record<string, MomentResult[]>>({})

  useEffect(() => {
    // Seed all queries: read from localStorage first, fetch if missing
    DISCOVERY_ROWS.forEach(async (query) => {
      const cached = getCachedResults(query)
      if (cached) {
        setCache(prev => ({ ...prev, [query]: cached }))
        return
      }
      const results = await fetchAndCache(query)
      if (results) {
        setCache(prev => ({ ...prev, [query]: results }))
      }
    })
  }, [])

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
      <div className="flex flex-col gap-8">
        {DISCOVERY_ROWS.map((query) => {
          const results = cache[query]
          // Use up to 5 real thumbnails, pad with placeholders if fewer
          const cards = CARD_SHADES.map((shade, i) => {
            const result = results?.[i]
            return { shade, result }
          })

          return (
            <div key={query}>
              <button
                onClick={() => router.push(`/?q=${encodeURIComponent(query)}`)}
                className="group flex items-center gap-1.5 mb-3 text-left"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {query}
                </span>
                <svg className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="flex gap-2.5">
                {cards.map(({ shade, result }, i) =>
                  result?.signedThumbnailUrl ? (
                    // Real thumbnail
                    <div
                      key={i}
                      className="flex-1 rounded-xl overflow-hidden border border-border/50 relative"
                      style={{ aspectRatio: '9/16' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.signedThumbnailUrl}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[10px] font-medium text-white/80 truncate">@{result.creatorHandle}</p>
                      </div>
                    </div>
                  ) : (
                    <PlaceholderCard key={i} shade={shade} />
                  )
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function MatchScore({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const hue = Math.round(score * 120)
  return (
    <div className="flex items-center gap-1.5" title={`${pct}% relevance`}>
      <div className="h-1.5 w-16 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: `hsl(${hue} 65% 42%)` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
    </div>
  )
}

interface MomentViewerProps {
  results: MomentResult[] | null
  searchError?: string | null
}

export default function MomentViewer({ results, searchError }: MomentViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (results === null) {
    return <DiscoveryState />
  }

  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {searchError && <p className="text-xs text-destructive mb-3">{searchError}</p>}
          <svg className="h-10 w-10 text-muted-foreground/30 mb-3 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <p className="text-sm text-foreground/60">No moments found</p>
          <p className="mt-1 text-xs text-muted-foreground">Try rephrasing your search.</p>
        </div>
      </div>
    )
  }

  function navigate(nextIdx: number) {
    if (nextIdx < 0 || nextIdx >= results!.length) return
    setSelectedIdx(nextIdx)
    setPlaying(false)
    setExpanded(false)
  }

  const canPrev = selectedIdx > 0
  const canNext = selectedIdx < results.length - 1

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden">

      {/* ── Center: vertical stack of all result cards ── */}
      <div className="flex-1 relative overflow-hidden">

        {/* The full stack — translateY scrolls the viewport to selectedIdx */}
        <div
          className="flex flex-col w-full"
          style={{
            transform: `translateY(calc(${-selectedIdx} * 100dvh))`,
            transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {results.map((result, i) => {
            const rStart = formatMs(result.startMs)
            const rEnd = formatMs(result.endMs)
            const isSelected = i === selectedIdx

            return (
              <div
                key={result.momentId}
                className="shrink-0 overflow-y-auto px-4 md:px-8 py-4 md:py-6 flex flex-col items-center gap-4"
                style={{ height: '100dvh' }}
              >
                {/* Portrait video */}
                <div
                  className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-black shadow-xl shrink-0"
                  style={{ aspectRatio: '9/16', maxHeight: 'calc(100dvh - 200px)' }}
                >
                  {isSelected && playing && result.signedVideoUrl ? (
                    <VideoPlayer
                      src={result.signedVideoUrl}
                      startMs={result.startMs}
                      endMs={result.endMs}
                    />
                  ) : result.signedThumbnailUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={result.signedThumbnailUrl}
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {result.signedVideoUrl && (
                        <button
                          onClick={() => isSelected && setPlaying(true)}
                          className="absolute inset-0 flex items-center justify-center group"
                          aria-label="Play clip"
                        >
                          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition shadow-xl border border-white/20">
                            <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </button>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8">
                        <p className="text-xs font-semibold text-primary mb-0.5">@{result.creatorHandle}</p>
                        <p className="text-sm font-medium text-white leading-snug line-clamp-2">{result.title}</p>
                        <span className="mt-1.5 inline-block text-xs tabular-nums text-white/60 bg-black/40 rounded px-1.5 py-0.5">
                          {rStart} – {rEnd}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 bg-muted">
                      <p className="text-xs font-semibold text-primary">@{result.creatorHandle}</p>
                      <p className="text-sm text-center text-foreground/80 line-clamp-3">{result.title}</p>
                      {result.signedVideoUrl && (
                        <button
                          onClick={() => isSelected && setPlaying(true)}
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition"
                          aria-label="Play clip"
                        >
                          <svg className="ml-0.5 h-5 w-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="w-full max-w-sm flex flex-col gap-3 pb-6">
                  <p className="text-sm leading-relaxed text-foreground/80">{result.summary}</p>

                  <div className="rounded-lg bg-muted/60 border border-border px-3 py-2.5">
                    <p className={`text-xs leading-relaxed text-muted-foreground italic ${isSelected && expanded ? '' : 'line-clamp-3'}`}>
                      &ldquo;{result.transcript}&rdquo;
                    </p>
                    {isSelected && result.transcript.length > 150 && (
                      <button
                        onClick={() => setExpanded(v => !v)}
                        className="mt-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        {expanded ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <MatchScore score={result.similarity} />
                    <a
                      href={result.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                      </svg>
                      View on TikTok
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Arrows — absolutely positioned, never move */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          <button
            onClick={() => navigate(selectedIdx - 1)}
            disabled={!canPrev}
            aria-label="Previous moment"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => navigate(selectedIdx + 1)}
            disabled={!canNext}
            aria-label="Next moment"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:bg-muted disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Right: mini stack — desktop only ── */}
      <div className="hidden md:flex w-60 shrink-0 border-l border-border overflow-y-auto py-4 px-2 flex-col gap-1">
        <p className="text-xs text-muted-foreground px-2 mb-2">Results</p>
        {results.map((r, i) => {
          const isActive = i === selectedIdx
          const rStart = formatMs(r.startMs)
          const rEnd = formatMs(r.endMs)
          return (
            <button
              key={r.momentId}
              onClick={() => navigate(i)}
              className={`w-full flex items-start gap-2.5 rounded-xl px-2 py-2 text-left transition-colors ${
                isActive
                  ? 'bg-card border border-primary/30'
                  : 'hover:bg-muted/60 border border-transparent'
              }`}
            >
              <div className="w-10 shrink-0 aspect-[9/16] rounded-md overflow-hidden bg-muted">
                {r.signedThumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.signedThumbnailUrl} alt={r.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-3 w-3 text-muted-foreground/40" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  @{r.creatorHandle}
                </p>
                <p className="text-xs leading-snug line-clamp-2 text-foreground/80 mt-0.5">{r.title}</p>
                <p className="text-xs tabular-nums text-muted-foreground/60 mt-1">{rStart} – {rEnd}</p>
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}
