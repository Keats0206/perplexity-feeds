import MomentCard from './MomentCard'
import type { MomentResult } from '@/lib/search/types'

interface MomentListProps {
  results: MomentResult[]
  query: string
}

export default function MomentList({ results, query }: MomentListProps) {
  if (results.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-white/50">No moments found for &ldquo;{query}&rdquo;</p>
        <p className="mt-1 text-xs text-white/30">Try a different query or check back after more content is ingested.</p>
      </div>
    )
  }

  return (
    <section className="mt-8 w-full max-w-2xl mx-auto">
      <p className="mb-4 text-xs text-white/40">
        {results.length} moment{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
      </p>
      <ul className="flex flex-col gap-4">
        {results.map((result) => (
          <li key={result.momentId}>
            <MomentCard result={result} />
          </li>
        ))}
      </ul>
    </section>
  )
}
