import { useEffect, useRef, useState } from 'react'
import { useReactMediaRecorder } from 'react-media-recorder'

import Modal from '../utils/Modal'

import Body from './Body'

import reset from './icons/reset.svg'

async function sendAudio(audio, blob) {
  audio.src = blob

  const audioBlob = await fetch(audio.src).then((res) => res.blob())

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

  const [showBody, setShowBody] = useState(false)
  const [showEvaluating, setShowEvaluating] = useState(false)

  useEffect(() => {
    if (status === 'stopped') {
      stopRecording()
      setShowEvaluating(true)
      sendAudio(audioRef.current, recordingBlob)
        .then((data) => {
          console.log(data)
          setShowBody(true)
          setShowEvaluating(false)
        })
        .catch((err) => {
          console.log(err)
          setShowBody(true)
          setShowEvaluating(false)
        })
      clearBlobUrl()
    }
  }, [status])

  return (
    showBot && (
      <Modal
        title="Rebot"
        onClose={() => setShowBot(false)}
        showActions={false}
      >
        <div className="relative min-h-full w-full">
          {showEvaluating && (
            <div className="py-3 text-transparent bg-clip-text bg-gradient-to-r to-purple-600 from-pink-800 font-semibold">
              Evaluating..
            </div>
          )}
          {showBody && <Body />}
          <div className="absolute bottom-4 flex items-center justify-center w-full py-4 max-h-fit">
            <button
              className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-800 rounded-full"
              onClick={() => {
                if (status === 'recording') {
                  stopRecording()
                } else {
                  setShowBody(false)
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
