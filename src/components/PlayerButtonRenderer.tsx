import ReactDOM from 'react-dom'
import { PIPButton } from './PIPButton'

const PlayerPortalStyle: React.CSSProperties = {
  display: 'flex',
  columnGap: '12px'
} as const

function PlayerButtonPortalContainer ({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('PlayerButtonPortalContainer mounted')
    return () => {
      console.log('PlayerButtonPortalContainer unmounted')
    }
  }, [])
  const portalTarget = usePortal({
    id: 'lime-button-portal',
    targetSelector: '.vjs-control.vjs-button.vjs-video-edit-open',
    position: 'before',
    style: PlayerPortalStyle
  })

  const isNotMinimized = document.querySelector('.LiveScreenView.video_screen__0b0d8018.disabled') !== null
  return portalTarget && isNotMinimized ? ReactDOM.createPortal(children, portalTarget) : null
}

export function PlayerButtonRenderer () {
  return (
    <PlayerButtonPortalContainer>
      <PIPButton />
    </PlayerButtonPortalContainer>
  )
}
