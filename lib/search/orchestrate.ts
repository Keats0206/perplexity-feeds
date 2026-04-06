import { embedQuery } from '@/lib/openai/embed'
import { getSupabaseServer } from '@/lib/supabase/server'
import type { MomentResult } from './types'

interface RpcRow {
  moment_id: string
  video_id: string
  creator_handle: string
  source_url: string
  title: string
  description: string
  summary: string
  transcript: string
  start_ms: number
  end_ms: number
  similarity: number
}

interface VideoRow {
  id: string
  video_storage_path: string | null
  thumbnail_storage_path: string | null
}

async function getSignedUrl(
  supabase: ReturnType<typeof getSupabaseServer>,
  bucket: string,
  path: string | null
): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600)
  if (error || !data?.signedUrl) return null
  return data.signedUrl
}

export async function searchMoments(query: string): Promise<MomentResult[]> {
  const supabase = getSupabaseServer()

  // 1. Embed the query
  const embedding = await embedQuery(query)

  // 2. Call the RPC — fetch extra rows so deduplication leaves enough results
  const { data: rpcRows, error: rpcError } = await supabase.rpc(
    'match_video_moments',
    {
      query_embedding: embedding,
      match_count: 30,
    }
  )

  if (rpcError) {
    throw new Error(`match_video_moments RPC failed: ${rpcError.message}`)
  }

  if (!rpcRows || rpcRows.length === 0) {
    return []
  }

  // 3. Deduplicate: keep only the highest-similarity moment per video
  const seen = new Map<string, RpcRow>()
  for (const row of rpcRows as RpcRow[]) {
    const existing = seen.get(row.video_id)
    if (!existing || row.similarity > existing.similarity) {
      seen.set(row.video_id, row)
    }
  }
  const rows = Array.from(seen.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)

  // 4. Fetch video storage paths for all matched videos (deduplicated)
  const videoIds = [...new Set(rows.map((r) => r.video_id))]
  const { data: videoRows, error: videoError } = await supabase
    .from('videos')
    .select('id, video_storage_path, thumbnail_storage_path')
    .in('id', videoIds)

  if (videoError) {
    throw new Error(`Failed to fetch video rows: ${videoError.message}`)
  }

  const videoMap = new Map<string, VideoRow>(
    (videoRows as VideoRow[]).map((v) => [v.id, v])
  )

  // 5. Generate signed URLs and normalize results
  const results: MomentResult[] = await Promise.all(
    rows.map(async (row) => {
      const video = videoMap.get(row.video_id)

      const [signedVideoUrl, signedThumbnailUrl] = await Promise.all([
        getSignedUrl(supabase, 'videos', video?.video_storage_path ?? null),
        getSignedUrl(supabase, 'thumbnails', video?.thumbnail_storage_path ?? null),
      ])

      return {
        momentId: row.moment_id,
        videoId: row.video_id,
        creatorHandle: row.creator_handle,
        title: row.title,
        description: row.description,
        summary: row.summary,
        transcript: row.transcript,
        startMs: row.start_ms,
        endMs: row.end_ms,
        similarity: row.similarity,
        tiktokUrl: row.source_url,
        signedVideoUrl,
        signedThumbnailUrl,
      }
    })
  )

  return results
}
