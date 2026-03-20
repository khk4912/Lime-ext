import { CustomVJSButton } from './CustomVJSButton'
import PIPIcon from '@/assets/pip.svg?react'

export function PIPButton () {
  return (
    <CustomVJSButton
      className='lime-pip-button'
      title='PIP 모드 토글'
      onClick={() => {
        makeVideoPIP().catch(() => { })
      }}
    >
      <PIPIcon style={{ padding: '3px' }} />
    </CustomVJSButton>
  )
}

async function makeVideoPIP (): Promise<void> {
  const video = document.querySelector('video.vjs-tech')

  if (video === null || !(video instanceof HTMLVideoElement)) {
    return
  }

  try {
    video.disablePictureInPicture = false
    if (document.pictureInPictureElement != null) {
      await document.exitPictureInPicture()
    } else {
      await video.requestPictureInPicture()
    }
  } catch {
    // Metadata 로드 안될 경우 오류 발생하므로 오류 무시
  }
}
