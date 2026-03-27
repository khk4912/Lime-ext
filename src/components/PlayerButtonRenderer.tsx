import ReactDOM from 'react-dom'

import { PIPButton } from './PIPButton'
import { AudioCompressorRenderer } from './AudioCompressorButton'
import { ScreenshotButton } from './ScreenshotButton'
import { RecordButton } from './RecordButton'

import { useOptions } from '@/providers/useOptions'

const PlayerPortalStyle: React.CSSProperties = {
  display: 'flex',
  columnGap: '12px'
} as const

function PlayerButtonPortalContainer ({ children }: { children: React.ReactNode }) {
  const portalTarget = usePortal({
    id: 'lime-button-portal',
    targetSelector: '.vjs-unified-time.vjs-time-control.vjs-control',
    position: 'after',
    style: PlayerPortalStyle
  })

  // TODO: 나중에 minimized에 별도 스타일로 버튼 추가?
  const dataLayoutVideoState = document.querySelector('section.Layout')?.getAttribute('data-layout-video-state')
  const isMinimized = dataLayoutVideoState === 'aside' || dataLayoutVideoState === 'aside_float'

  return portalTarget && !isMinimized ? ReactDOM.createPortal(children, portalTarget) : null
}

export function PlayerButtonRenderer () {
  const { options, isLoading } = useOptions()
  const [targetFound, setTargetFound] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => {
      const target = document.querySelector('.vjs-control-bar')
      if (target) {
        setTargetFound(true)
        window.clearInterval(interval)
      }
    }, 100)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  if (isLoading) {
    return null
  }

  return (
    targetFound &&
      <PlayerButtonPortalContainer>
        {options.rec && <RecordButton />}
        {options.screenshot && <ScreenshotButton />}
        {options.pip && <PIPButton />}
        {options.useAudioCompressor && <AudioCompressorRenderer />}
      </PlayerButtonPortalContainer>
  )
}
