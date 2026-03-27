import { LIME_DEFAULT_OPTIONS, type LimeOptions } from '@/utils/options'

type CompressorDetails = LimeOptions['compressorDetails']

type CompressorSnapshot = {
  hasVideo: boolean
  isActive: boolean
}

const sourceByVideo = new WeakMap<HTMLVideoElement, MediaElementAudioSourceNode>()
const listeners = new Set<() => void>()

let snapshot: CompressorSnapshot = {
  hasVideo: false,
  isActive: false
}

let targetVideo: HTMLVideoElement | null = null
let audioContext: AudioContext | null = null
let source: MediaElementAudioSourceNode | null = null
let compressor: DynamicsCompressorNode | null = null
let isActive = false
let details: CompressorDetails = LIME_DEFAULT_OPTIONS.compressorDetails

function publish () {
  snapshot = {
    hasVideo: targetVideo !== null,
    isActive
  }

  listeners.forEach((listener) => listener())
}

function ensureContext (): AudioContext {
  audioContext ??= new AudioContext()
  return audioContext
}

function getSource (video: HTMLVideoElement): MediaElementAudioSourceNode {
  const cached = sourceByVideo.get(video)

  if (cached !== undefined) {
    return cached
  }

  const nextSource = ensureContext().createMediaElementSource(video)
  sourceByVideo.set(video, nextSource)
  return nextSource
}

function ensureCompressor (): DynamicsCompressorNode {
  compressor ??= ensureContext().createDynamicsCompressor()
  return compressor
}

function applyDetails () {
  if (compressor === null) {
    return
  }

  compressor.threshold.value = details.threshold
  compressor.knee.value = details.knee
  compressor.ratio.value = details.ratio
  compressor.attack.value = details.attack / 1000
  compressor.release.value = details.release / 1000
}

function disconnectGraph () {
  source?.disconnect()
  compressor?.disconnect()
}

async function ensureGraph () {
  if (targetVideo === null) {
    source = null
    return
  }

  source = getSource(targetVideo)
  ensureCompressor()
  applyDetails()

  if (audioContext?.state === 'suspended') {
    try {
      await audioContext.resume()
    } catch {
      // 버튼 클릭이 아닌 시점에는 resume이 실패할 수 있으므로 무시합니다.
    }
  }
}

function reconnectGraph () {
  if (source === null || audioContext === null) {
    return
  }

  disconnectGraph()

  if (isActive) {
    const activeCompressor = ensureCompressor()
    applyDetails()
    source.connect(activeCompressor)
    activeCompressor.connect(audioContext.destination)
    return
  }

  source.connect(audioContext.destination)
}

export const audioCompressorRuntime = {
  subscribe (listener: () => void) {
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  },

  getSnapshot () {
    return snapshot
  },

  async attach (video: HTMLVideoElement | null) {
    if (video === null) {
      disconnectGraph()

      targetVideo = null
      source = null

      publish()
      return
    }

    if (video !== targetVideo) {
      disconnectGraph()

      targetVideo = video
      source = null
    }

    if (audioContext !== null || isActive) {
      await ensureGraph()
      reconnectGraph()
    }

    publish()
  },

  setDetails (nextDetails: CompressorDetails) {
    details = nextDetails
    applyDetails()
    publish()
  },

  async setActive (nextIsActive: boolean) {
    isActive = nextIsActive

    if (nextIsActive) {
      await ensureGraph()
    }

    reconnectGraph()
    publish()
  },

  forceDisable () {
    isActive = false
    reconnectGraph()
    publish()
  }
}
