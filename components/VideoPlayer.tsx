'use client'

import { useRef, useEffect } from 'react'

interface VideoPlayerProps {
  src: string
  startMs: number
  endMs: number
}

export default function VideoPlayer({ src, startMs, endMs }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = startMs / 1000
  }, [src, startMs])

  function handleTimeUpdate() {
    const video = videoRef.current
    if (!video) return
    if (video.currentTime >= endMs / 1000) {
      video.pause()
    }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      onTimeUpdate={handleTimeUpdate}
      className="w-full rounded-lg bg-black"
      preload="metadata"
    />
  )
}
