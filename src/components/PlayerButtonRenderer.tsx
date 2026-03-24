import ReactDOM from 'react-dom'

import { PIPButton } from './PIPButton'
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

    console.log('PlayerButtonRenderer mounted, searching for target element...')

    return () => {
      console.log('PlayerButtonRenderer unmounted, clearing interval...')
      window.clearInterval(interval)
    }
  }, [])

  if (isLoading || (!options.rec && !options.pip && !options.screenshot && !options.seek)) {
    return null
  }

  return (
    targetFound &&
      <PlayerButtonPortalContainer>
        {options.rec && <RecordButton />}
        {options.screenshot && <ScreenshotButton />}
        {options.pip && <PIPButton />}
      </PlayerButtonPortalContainer>
  )
}
