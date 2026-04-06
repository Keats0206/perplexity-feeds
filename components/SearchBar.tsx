'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  initialQuery: string
}

export default function SearchBar({ initialQuery }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    startTransition(() => {
      router.push('/?q=' + encodeURIComponent(trimmed))
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. how to optimize sleep..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={isPending || !value.trim()}
          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
        >
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  )
}
