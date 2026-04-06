export interface MomentResult {
  momentId: string
  videoId: string
  creatorHandle: string
  title: string
  description: string
  summary: string
  transcript: string
  startMs: number
  endMs: number
  similarity: number
  tiktokUrl: string
  signedVideoUrl: string | null
  signedThumbnailUrl: string | null
}
