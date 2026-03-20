import { getStreamInfo } from '@/utils/steram_info'
import { CustomVJSButton } from './CustomVJSButton'
import ScreenshotIcon from '@/assets/screenshot.svg?react'
import { sanitizeFileName, ymdhms } from '@/utils/file'
export function ScreenshotButton () {
  return (
    <CustomVJSButton
      className='lime-screenshot-button'
      title='스크린샷'
      onClick={() => { downloadVideoScreenshot() }}
    >
      <ScreenshotIcon style={{ padding: '3px' }} />
    </CustomVJSButton>
  )
}

function downloadVideoScreenshot (): void {
  const video = document.querySelector('video.vjs-tech')
  const streamInfo = getStreamInfo()

  if (streamInfo === null) { return }

  if (video === null || !(video instanceof HTMLVideoElement)) {
    return
  }

  const { title, streamerName } = streamInfo

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    return
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  canvas.toBlob(blob => {
    if (blob === null) {
      return
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = sanitizeFileName(`${streamerName}_${title}_${ymdhms(new Date())}.png`)
    a.click()

    URL.revokeObjectURL(url)
  })
}
