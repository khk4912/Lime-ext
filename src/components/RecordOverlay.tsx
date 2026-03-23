import { useState, useRef } from 'react'
import ReactDOM from 'react-dom'

import { usePortal } from '@/hooks/element'
import styles from './RecordOverlay.module.css'

const secondsToTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const remainSeconds = (seconds % 60).toString().padStart(2, '0')

  return `${minutes}:${remainSeconds}`
}

function RecordOverlay () {
  const [sec, setSec] = useState(0)
  const intervalRef = useRef<number>(null)

  const start = () => {
    if (intervalRef.current) return
    intervalRef.current = window.setInterval(() => {
      setSec(prev => prev + 1)
    }, 1000)
  }
  const stop = () => {
    if (!intervalRef.current) return
    clearInterval(intervalRef.current)

    intervalRef.current = null
    setSec(0)
  }

  useEffect(() => {
    start()
    return () => { stop() }
  }, [])

  return (
    <div className={styles.overlay}>
      <div className={styles.redDot} />
      {secondsToTime(sec)}
    </div>
  )
}

function RecordOverlayContainer ({ children }: { children: React.ReactNode }) {
  const portal = usePortal({
    id: 'lime-record-overlay',
    targetSelector: '#vjs_video_3',
    position: 'before',
    style: {
      position: 'absolute',
      zIndex: 9999,
      top: '3%',
      left: '3%'
    }
  })

  return portal && ReactDOM.createPortal(children, portal)
}

export function RecordOverlayRenderer () {
  return (
    <RecordOverlayContainer>
      <RecordOverlay />
    </RecordOverlayContainer>
  )
}
