'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface HLSPlayerProps {
  src: string
}

export default function HLSPlayer({ src }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    hlsRef.current?.destroy()

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari 原生支持
      video.src = src
    } else if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      hlsRef.current = hls
    } else {
      console.error('Browser does not support HLS playback.')
    }

    return () => {
      hlsRef.current?.destroy()
    }
  }, [src])

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      style={{ width: '100%', maxWidth: '960px', aspectRatio: '16/9' }}
    />
  )
}
