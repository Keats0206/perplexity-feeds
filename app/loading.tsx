export default function Loading() {
  return (
    <div className="flex-1 flex h-screen overflow-hidden">

      {/* Left sidebar skeleton */}
      <div className="w-80 shrink-0 flex flex-col border-r border-border bg-sidebar">
        <div className="flex-1 px-4 py-6 flex flex-col justify-end gap-3">
          <div className="h-4 w-36 rounded bg-muted animate-pulse" />
          <div className="h-3 w-48 rounded bg-muted/70 animate-pulse" />
          <div className="flex flex-col gap-1.5 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <div className="h-24 rounded-2xl bg-card border border-border animate-pulse" />
        </div>
      </div>

      {/* Center: featured video skeleton */}
      <div className="flex-1 overflow-hidden px-8 py-6 flex flex-col items-center gap-4">
        <div
          className="w-full max-w-sm rounded-2xl bg-muted animate-pulse"
          style={{ aspectRatio: '9/16', maxHeight: 'calc(100vh - 220px)' }}
        />
        <div className="w-full max-w-sm flex flex-col gap-2">
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-16 rounded-lg bg-card border border-border animate-pulse mt-1" />
        </div>
      </div>

      {/* Right stack skeleton */}
      <div className="w-60 shrink-0 border-l border-border py-4 px-2 flex flex-col gap-1">
        <div className="h-2 w-12 rounded bg-muted animate-pulse mx-2 mb-2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl px-2 py-2" style={{ opacity: 1 - i * 0.12 }}>
            <div className="w-10 shrink-0 aspect-[9/16] rounded-md bg-muted animate-pulse" />
            <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
              <div className="h-2 w-16 rounded bg-muted animate-pulse" />
              <div className="h-2 w-full rounded bg-muted/70 animate-pulse" />
              <div className="h-2 w-3/4 rounded bg-muted/50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
