'use client'

export default function ClearCacheButton() {
  function handleClear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith('pf:discovery:'))
      .forEach(k => localStorage.removeItem(k))
    window.location.reload()
  }

  return (
    <button
      onClick={handleClear}
      className="w-full text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors py-1.5"
    >
      Clear cache
    </button>
  )
}
