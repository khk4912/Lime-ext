import ReactDOM from 'react-dom'
import styles from './Buttons.module.css'

const VJSButtonStyle: React.CSSProperties = {
  content: '',
  inset: 0,
  display: 'block',
  backgroundImage: 'url(https://static.cf.cime.kr/public/assets/images/video/v1_icons/icon_scissors.svg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '20px',
  backgroundPosition: 'center',
  borderRadius: '999px',
  background: 'var(--dim-200)',
  color: 'var(--light-overlay-70)',
  WebkitBackdropFilter: 'blur(0.25rem)',
  backdropFilter: 'blur(0.25rem)',
} as const

function CustomVJSButton ({ className }: { className?: string }) {
  return (
    <button
      className={`vjs-control vjs-button ${styles.limeCustomVjsButton} ${className ?? ''} `}
      style={VJSButtonStyle}
    >
      Click me
    </button>
  )
}

function VJSButtonPortalContainer ({ children }: { children: React.ReactNode }) {
  const portalTarget = usePortal({
    id: 'lime-button-portal',
    targetSelector: '.vjs-control.vjs-button.vjs-video-edit-open',
    position: 'before'
  })
  return portalTarget ? ReactDOM.createPortal(children, portalTarget) : null
}

export function VJSButtonRenderer () {
  return (
    <VJSButtonPortalContainer>
      <CustomVJSButton className='' />
    </VJSButtonPortalContainer>
  )
}
