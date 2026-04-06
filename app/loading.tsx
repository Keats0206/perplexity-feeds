export default function Loading() {
  return (
    <div className="flex flex-col items-center min-h-full bg-background text-foreground">
      <main className="w-full max-w-2xl px-4 py-16 flex flex-col items-center gap-6">
        <div className="w-full max-w-2xl mx-auto flex gap-2">
          <div className="flex-1 h-12 rounded-xl bg-white/5 animate-pulse" />
          <div className="w-24 h-12 rounded-xl bg-white/5 animate-pulse" />
        </div>
        <div className="mt-4 w-full flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 h-48 animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  )
}
