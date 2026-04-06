'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
    <main className="flex-1 flex items-center justify-center px-4">
      <Card className="w-full max-w-sm bg-card border-border rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold mb-1">Something went wrong</h2>
          <p className="text-xs text-muted-foreground mb-6">{error.message}</p>
          <Button
            onClick={reset}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            Try again
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
