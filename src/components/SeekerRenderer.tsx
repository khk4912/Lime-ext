import { useOptions } from '@/providers/useOptions'
import { Seeker } from './Seek'

const Target = '.vjs-control'

const isLive = () => {
  return window.location.pathname.endsWith('/live')
}

export function SeekerRenderer () {
  const { options, isLoading } = useOptions()
  const [targetFound, setTargetFound] = useState(false)

  useEffect(() => {
    const interval = window.setInterval(() => {
      const target = document.querySelector(Target)
      if (target) {
        setTargetFound(true)
        window.clearInterval(interval)
      }
    }, 100)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  if (isLoading || !options.seek) {
    return null
  }

  return (
    targetFound && isLive() && <Seeker />
  )
}
