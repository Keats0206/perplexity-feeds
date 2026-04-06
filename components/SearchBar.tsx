'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
  initialQuery: string
  compact?: boolean
}

export default function SearchBar({ initialQuery, compact = false }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    startTransition(() => {
      router.push('/?q=' + encodeURIComponent(trimmed))
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        rows={compact ? 1 : 3}
        className={`w-full resize-none rounded-2xl bg-transparent px-4 text-sm leading-relaxed placeholder:text-muted-foreground focus:outline-none ${compact ? 'py-2.5 pr-12' : 'pt-3 pb-10'}`}
      />
      {/* Bottom bar */}
      <div className={`${compact ? 'absolute right-2 top-1/2 -translate-y-1/2' : 'absolute bottom-2.5 left-3 right-2.5 flex items-center justify-between'}`}>
        {!compact && <span className="text-xs text-muted-foreground/50">⏎ to search</span>}
        <Button
          onClick={submit}
          size="icon-sm"
          disabled={isPending || !value.trim()}
          className="h-7 w-7 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30"
          aria-label="Search"
        >
          {isPending ? (
            <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  )
}
