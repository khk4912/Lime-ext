import { useElementTarget } from './element'

export type BufferedRange = {
  start: number
  end: number
}

export interface IvsQualityLike {
  name: string
  bitrate: number
  width: number
  height: number
}

export interface IvsPlayerLike {
  getPosition(): number
  getBuffered(): BufferedRange | null
  seekTo(position: number): void
  getBufferDuration?(): number
  getLiveLatency?(): number
  getQuality?(): IvsQualityLike
  getQualities?(): IvsQualityLike[]
  setRebufferToLive?(enabled: boolean): void
}

interface VideoJsTechLike {
  getIVSPlayer?: () => IvsPlayerLike | undefined
}

interface VideoJsLikePlayer {
  getIVSPlayer?: () => IvsPlayerLike | undefined
  tech?: (safe?: true) => VideoJsTechLike | null
}

interface VideoPlayerViewLike {
  player?: VideoJsLikePlayer
}

interface RuneLike {
  getUnknownView(element: Element): unknown
}

declare global {
  interface Window {
    __rune__?: RuneLike
  }
}

export type PlaybackTarget =
  | {
    kind: 'ivs'
    video: HTMLVideoElement
    player: IvsPlayerLike
  }
  | {
    kind: 'html'
    video: HTMLVideoElement
  }

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export function resolvePlaybackTarget (video: HTMLVideoElement): PlaybackTarget {
  const root = video.closest('[data-rune="VideoPlayerView"]')
  const rune = window.__rune__

  if (root !== null && rune !== undefined) {
    const view = rune.getUnknownView(root)

    if (isObject(view)) {
      const maybeView = view as VideoPlayerViewLike
      const player = maybeView.player

      if (player !== undefined) {
        const ivs =
          player.getIVSPlayer?.() ??
          player.tech?.(true)?.getIVSPlayer?.()

        if (ivs !== undefined) {
          return {
            kind: 'ivs',
            video,
            player: ivs
          }
        }
      }
    }
  }

  return {
    kind: 'html',
    video
  }
}

export function usePlaybackTarget (selector = 'video.vjs-tech'): PlaybackTarget | null {
  const videoElement = useElementTarget(selector)
  return videoElement instanceof HTMLVideoElement
    ? resolvePlaybackTarget(videoElement)
    : null
}
