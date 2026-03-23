import { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { useElementTarget, usePortal } from '@/hooks/element'
import { useShortcut } from '@/hooks/key'

import style from './Seek.module.css'
import LeftIcon from '@/assets/left.svg?react'
import RightIcon from '@/assets/right.svg?react'

type SeekDirection = 'left' | 'right' | null

type BufferedRange = {
  start: number
  end: number
}

interface IvsPlayerLike {
  getPosition(): number
  getBuffered(): BufferedRange | null
  seekTo(position: number): void
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

type PlaybackTarget =
  | {
    kind: 'ivs'
    video: HTMLVideoElement
    player: IvsPlayerLike
  }
  | {
    kind: 'html'
    video: HTMLVideoElement
  }

const SEEK_SECONDS = 5
const EDGE_GUARD = 0

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

function resolvePlaybackTarget (video: HTMLVideoElement): PlaybackTarget {
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
          ivs.setRebufferToLive?.(false)

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

function findCurrentRange (target: PlaybackTarget): BufferedRange | null {
  if (target.kind === 'ivs') {
    return target.player.getBuffered()
  }

  const { video } = target
  const t = video.currentTime

  for (let i = 0; i < video.buffered.length; i += 1) {
    const start = video.buffered.start(i)
    const end = video.buffered.end(i)

    if (t >= start && t <= end) {
      return { start, end }
    }
  }

  return null
}

function getCurrentPosition (target: PlaybackTarget): number {
  if (target.kind === 'ivs') {
    return target.player.getPosition()
  }

  return target.video.currentTime
}

function setCurrentPosition (target: PlaybackTarget, nextPosition: number): void {
  if (target.kind === 'ivs') {
    target.player.seekTo(nextPosition)
    return
  }

  target.video.currentTime = nextPosition
}

function seekLeft (target: PlaybackTarget): void {
  const range = findCurrentRange(target)
  if (range === null) return

  const next = Math.max(range.start + EDGE_GUARD, getCurrentPosition(target) - SEEK_SECONDS)
  setCurrentPosition(target, next)
}

function seekRight (target: PlaybackTarget): void {
  const range = findCurrentRange(target)
  if (range === null) return

  const next = Math.min(range.end - EDGE_GUARD, getCurrentPosition(target) + SEEK_SECONDS)
  setCurrentPosition(target, next)
}

export function Seeker () {
  const videoElement = useElementTarget('video.vjs-tech')
  const playbackRef = useRef<PlaybackTarget | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)

  const [activeDirection, setActiveDirection] = useState<SeekDirection>(null)

  useEffect(() => {
    playbackRef.current =
      videoElement instanceof HTMLVideoElement
        ? resolvePlaybackTarget(videoElement)
        : null
  }, [videoElement])

  const showOverlay = (direction: Exclude<SeekDirection, null>) => {
    setActiveDirection(direction)

    if (hideTimeoutRef.current !== null) {
      window.clearTimeout(hideTimeoutRef.current)
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      setActiveDirection(null)
      hideTimeoutRef.current = null
    }, 500)
  }

  useShortcut('ArrowLeft', () => {
    const target = playbackRef.current
    if (target === null) return

    seekLeft(target)
    showOverlay('left')
  })

  useShortcut('ArrowRight', () => {
    const target = playbackRef.current
    if (target === null) return

    seekRight(target)
    showOverlay('right')
  })

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return (
    <SeekContainer>
      <SeekLeftOverlay active={activeDirection === 'left'} />
      <SeekRightOverlay active={activeDirection === 'right'} />
    </SeekContainer>
  )
}

function SeekLeftOverlay ({ active }: { active: boolean }) {
  return (
    <div className={`${style.seekLeft} ${style.seekOverlay} ${active ? style.seekActive : ''}`}>
      <div>
        <LeftIcon />
        <p>- 5초</p>
      </div>
    </div>
  )
}

function SeekRightOverlay ({ active }: { active: boolean }) {
  return (
    <div className={`${style.seekRight} ${style.seekOverlay} ${active ? style.seekActive : ''}`}>
      <div>
        <RightIcon />
        <p>+ 5초</p>
      </div>
    </div>
  )
}

function SeekContainer ({ children }: { children: React.ReactNode }) {
  const portal = usePortal({
    id: 'lime-seek-portal',
    targetSelector: 'video.vjs-tech',
    position: 'before',
    style: {
      position: 'absolute',
      zIndex: 2,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      gap: '30%'
    }
  })

  return portal && ReactDOM.createPortal(children, portal)
}
