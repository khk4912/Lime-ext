import { useRecord } from '@/hooks/record'
import { useShortcut } from '@/hooks/key'

import { CustomVJSButton } from './CustomVJSButton'
import RecordIcon from '@/assets/record.svg?react'

const RecordingColor = '#ff6161'

export function RecordButton () {
  const { isRecording, toggle } = useRecord()
  useShortcut('R', toggle)
  return (
    <CustomVJSButton
      className='lime-record-button'
      title='녹화 (R)'
      onClick={toggle}
    >
      <RecordIcon
        style={{ padding: '3px' }}
        fill={isRecording ? RecordingColor : 'currentColor'}
      />
    </CustomVJSButton>
  )
}
