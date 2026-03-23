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
    targetSelector: '.vjs-control.vjs-button.vjs-video-edit-open',
    position: 'before',
    style: PlayerPortalStyle
  })

  // TODO: 나중에 minimized에 별도 스타일로 버튼 추가?
  const isMinimized = document.querySelector('section.Layout')?.getAttribute('data-layout-video-state') !== 'screen'
  return portalTarget && !isMinimized ? ReactDOM.createPortal(children, portalTarget) : null
}

export function PlayerButtonRenderer () {
  const { options, isLoading } = useOptions()

  if (isLoading || (!options.rec && !options.pip && !options.screenshot)) {
    return null
  }

  return (
    <PlayerButtonPortalContainer>
      {options.rec && <RecordButton />}
      {options.screenshot && <ScreenshotButton />}
      {options.pip && <PIPButton />}
    </PlayerButtonPortalContainer>
  )
}
