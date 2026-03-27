import { useSyncExternalStore } from 'react'
import ReactDOM from 'react-dom'

import { CustomVJSButton } from './CustomVJSButton'
import { usePortal } from '@/hooks/element'
import { audioCompressorRuntime } from '@/features/audio-compressor/runtime'

import EQIcon from '@/assets/eq.svg?react'

const ActivatedColor = '#71ff34'

function AudioCompressorButton () {
  const { hasVideo, isActive } = useSyncExternalStore(
    (listener) => audioCompressorRuntime.subscribe(listener),
    () => audioCompressorRuntime.getSnapshot()
  )

  return (
    <CustomVJSButton
      className='lime-audio-compressor-button'
      title='오디오 컴프레서 활성화'
      onClick={() => {
        void audioCompressorRuntime.setActive(!isActive)
      }}
    >
      <EQIcon
        style={{
          padding: '3px',
          opacity: hasVideo ? 1 : 0.5
        }}
        fill={isActive ? ActivatedColor : 'white'}
      />
    </CustomVJSButton>
  )
}

function AudioCompressorContainer ({ children }: { children: React.ReactNode }) {
  const portal = usePortal({
    id: 'lime-audio-compressor',
    targetSelector: 'button.vjs-play-control',
    position: 'after',
  })

  return portal && ReactDOM.createPortal(children, portal)
}

export function AudioCompressorRenderer () {
  return (
    <AudioCompressorContainer>
      <AudioCompressorButton />
    </AudioCompressorContainer>
  )
}
