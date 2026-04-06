'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-background text-foreground px-4">
      <div className="text-center max-w-sm">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-foreground/50 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
