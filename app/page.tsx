import { searchMoments } from '@/lib/search/orchestrate'
import SearchBar from '@/components/SearchBar'
import MomentViewer from '@/components/MomentViewer'
import ClearCacheButton from '@/components/ClearCacheButton'
import Link from 'next/link'

const SUGGESTIONS = [
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
    <div className="flex-1 flex flex-col md:flex-row h-[100dvh] md:h-screen overflow-hidden">

      {/* ── Mobile header ── */}
      <div className="md:hidden shrink-0 flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar">
        {query ? (
          <>
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <p className="text-sm font-medium text-foreground truncate max-w-[60%] text-center">{query}</p>
            <div className="w-12" />
          </>
        ) : (
          <>
            <div>
              <p className="text-base font-semibold tracking-tight text-foreground leading-none">perplexity</p>
              <p className="text-xs font-medium text-primary mt-0.5 tracking-wide">feeds</p>
            </div>
            <p className="text-[10px] text-muted-foreground text-right leading-snug">
              built by<br />
              <span className="font-medium text-foreground/70">peter keating</span>
            </p>
          </>
        )}
      </div>

      {/* ── Desktop left sidebar ── */}
      <div className="hidden md:flex w-80 shrink-0 flex-col border-r border-border bg-sidebar">

        {/* Logo header */}
        <div className="px-5 pt-5 pb-4 border-b border-border flex items-end justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-foreground leading-none">perplexity</p>
            <p className="text-xs font-medium text-primary mt-0.5 tracking-wide">feeds</p>
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug text-right">
            built by<br />
            <span className="font-medium text-foreground/70">peter keating</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col justify-end gap-3">

          {!query && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Feed your curiosity without the algorithmic addictions.
              </p>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">Try asking</p>
                {SUGGESTIONS.map((s) => (
                  <a
                    key={s}
                    href={`/?q=${encodeURIComponent(s)}`}
                    className="text-xs px-3 py-2 rounded-xl border border-border bg-card hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          )}

          {query && (
            <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
              <p className="text-xs text-primary font-medium mb-0.5">You asked</p>
              <p className="text-sm text-foreground">{query}</p>
            </div>
          )}

          {searchError && (
            <p className="text-xs text-destructive px-1">{searchError}</p>
          )}

          {results !== null && results.length > 0 && (
            <div className="rounded-2xl bg-card border border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Found <span className="text-primary font-medium">{results.length}</span> matching moment{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="px-4 pt-4 pb-2 border-t border-border bg-sidebar">
          <SearchBar initialQuery={query} />
          <ClearCacheButton />
        </div>
      </div>

      {/* ── Content ── */}
      <MomentViewer results={results} searchError={searchError} />

      {/* ── Mobile bottom search bar ── */}
      <div className="md:hidden shrink-0 px-3 pt-3 pb-4 border-t border-border bg-sidebar">
        <SearchBar initialQuery={query} compact />
        <ClearCacheButton />
      </div>

    </div>
  )
}
