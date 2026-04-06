'use client'

import { useState } from 'react'
import VideoPlayer from './VideoPlayer'
import type { MomentResult } from '@/lib/search/types'

interface MomentCardProps {
  result: MomentResult
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function SimilarityBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium tabular-nums"
      title="Relevance score"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {pct}% match
    </span>
  )
}

export default function MomentCard({ result }: MomentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(false)

  const timestampRange = `${formatMs(result.startMs)} – ${formatMs(result.endMs)}`

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-xs font-medium text-white/50">@{result.creatorHandle}</p>
          <h2 className="text-sm font-semibold leading-snug truncate">{result.title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs tabular-nums text-white/60">
            {timestampRange}
          </span>
          <SimilarityBadge score={result.similarity} />
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm leading-relaxed text-white/80">{result.summary}</p>

      {/* Transcript snippet */}
      <div>
        <p
          className={`text-xs leading-relaxed text-white/50 ${expanded ? '' : 'line-clamp-2'}`}
        >
          &ldquo;{result.transcript}&rdquo;
        </p>
        {result.transcript.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs text-white/40 hover:text-white/60 transition"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Player or thumbnail */}
      {playing && result.signedVideoUrl ? (
        <VideoPlayer
          src={result.signedVideoUrl}
          startMs={result.startMs}
          endMs={result.endMs}
        />
      ) : result.signedThumbnailUrl ? (
        <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.signedThumbnailUrl}
            alt={result.title}
            className="w-full h-full object-cover"
          />
          {result.signedVideoUrl && (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
              aria-label="Play clip"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                <svg className="ml-1 h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      ) : result.signedVideoUrl ? (
        <button
          onClick={() => setPlaying(true)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium hover:bg-white/10 transition"
        >
          Play clip ({timestampRange})
        </button>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        {!playing && result.signedVideoUrl && !result.signedThumbnailUrl && null}
        <a
          href={result.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
          </svg>
          Open on TikTok
        </a>
      </div>
    </article>
  )
}
