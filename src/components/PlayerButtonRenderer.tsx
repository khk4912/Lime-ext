import ReactDOM from 'react-dom'
import { CustomVJSButton } from './CustomVJSButton'

function PlayerButtonPortalContainer ({ children }: { children: React.ReactNode }) {
  const portalTarget = usePortal({
    id: 'lime-button-portal',
    targetSelector: '.vjs-control.vjs-button.vjs-video-edit-open',
    position: 'before',
    style: {
      display: 'flex',
      columnGap: '12px'
    }
  })

  return portalTarget ? ReactDOM.createPortal(children, portalTarget) : null
}

export function PlayerButtonRenderer () {
  return (
    <PlayerButtonPortalContainer>
      <CustomVJSButton className=''>1</CustomVJSButton>
      <CustomVJSButton className=''>2</CustomVJSButton>
      <CustomVJSButton className=''>3</CustomVJSButton>
    </PlayerButtonPortalContainer>
  )
}
