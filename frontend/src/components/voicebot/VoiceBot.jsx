import { useEffect, useRef } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

import Modal from '../utils/Modal'

import reset from './icons/reset.svg'

async function sendAudio(audio, blob) {
  audio.src = blob

  const audioBlob = await fetch(audio.src).then(res => res.blob())

  const formData = new FormData()
  formData.append('audio', audioBlob, 'audio.wav')
  formData.append('id', localStorage.getItem('token'))

  const headers = new Headers()
  headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'))

  const response = await fetch(import.meta.env.VITE_AI_ENDPOINT + '/execute', {
    method: 'POST',
    body: formData,
    headers,
  })

  const data = await response.json()

  return data
}

export default function VoiceBot({ showBot, setShowBot }) {
  const {
    clearBlobUrl,
    startRecording,
    stopRecording,
    status,
    mediaBlobUrl: recordingBlob,
  } = useReactMediaRecorder({
    audio: true,
    video: false,
    blobPropertyBag: { type: 'audio/wav', endings: 'native' },
  })

  const audioRef = useRef(null)

  useEffect(() => {
    if (status === 'stopped') {
      stopRecording()
      sendAudio(audioRef.current, recordingBlob)
      clearBlobUrl()
    }
  }, [status])

  return (
    showBot && (
      <Modal
        title='Rebot'
        onClose={() => setShowBot(false)}
        showActions={false}
      >
        <div className='relative min-h-full w-full'>
          <div className='absolute bottom-4 flex items-center justify-center w-full py-4 max-h-fit'>
            <button
              className='px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-800 rounded-full'
              onClick={() => {
                if (status === 'recording') {
                  stopRecording()
                } else {
                  startRecording()
                  console.log('started')
                }
                status === ''
              }}
            >
              {status === 'idle' && 'Record'}
              {status === 'recording' && 'Stop'}
            </button>
            <audio src={recordingBlob} ref={audioRef} />
          </div>
        </div>
      </Modal>
    )
  )
}
