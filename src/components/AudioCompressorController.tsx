import { useEffect } from 'react'

import { usePlaybackTarget } from '@/hooks/playback'
import { useOptions } from '@/providers/useOptions'
import { audioCompressorRuntime } from '@/features/audio-compressor/runtime'

export function AudioCompressorController () {
  const playbackTarget = usePlaybackTarget()
  const { options } = useOptions()

  useEffect(() => {
    void audioCompressorRuntime.attach(playbackTarget?.video ?? null)
  }, [playbackTarget?.video])

  useEffect(() => {
    audioCompressorRuntime.setDetails(options.compressorDetails)
  }, [options.compressorDetails])

  useEffect(() => {
    if (!options.useAudioCompressor) {
      audioCompressorRuntime.forceDisable()
    }
  }, [options.useAudioCompressor])

  return null
}
