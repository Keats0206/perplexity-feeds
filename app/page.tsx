import { searchMoments } from '@/lib/search/orchestrate'
import SearchBar from '@/components/SearchBar'
import MomentList from '@/components/MomentList'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let results = null
  let searchError: string | null = null

  if (query) {
    try {
      results = await searchMoments(query)
    } catch (err) {
      searchError = err instanceof Error ? err.message : 'Search failed'
    }
  }

  return (
    <div className="flex flex-col items-center min-h-full bg-background text-foreground">
      <main className="w-full max-w-2xl px-4 py-16 flex flex-col items-center gap-6">
        {/* Hero */}
        {!query && (
          <div className="text-center mb-4">
            <h1 className="text-3xl font-semibold tracking-tight">Moments</h1>
            <p className="mt-2 text-sm text-foreground/50">
              Search for the exact clip you're thinking of.
            </p>
          </div>
        )}

        <SearchBar initialQuery={query} />

        {searchError && (
          <p className="text-sm text-red-400">{searchError}</p>
        )}

        {results !== null && (
          <MomentList results={results} query={query} />
        )}
      </main>
    </div>
  )
}
