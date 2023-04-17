import { useEffect, useState } from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'

import Modal from '../utils/Modal'

import reset from './icons/reset.svg'

async function sendAudio(blob, id) {
  const formData = new FormData()
  formData.append(
    'audio',
    new Blob([blob], { type: 'audio/webm' }),
    'audio.webm',
  )
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
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    startRecording,
    stopRecording,
    togglePauseResume,
  } = useAudioRecorder()

  const [status, setStatus] = useState(null)
  const [recorded, setRecorded] = useState(false)

  console.log(status)

  const handleStop = async () => {
    stopRecording()
    sendAudio(recordingBlob)
  }

  return (
    showBot && (
      <Modal
        title="Rebot"
        onClose={() => setShowBot(false)}
        showActions={false}
      >
        <div className="relative min-h-full w-full">
          <div className="absolute bottom-4 flex items-center justify-center w-full py-4 max-h-fit">
            <button
              className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-pink-800 rounded-full"
              onClick={() => {
                if (isRecording && !recorded) {
                  setRecorded(true)
                  handleStop()
                } else if (!isPaused && !recorded) {
                  startRecording()
                }
              }}
            >
              {recorded
                ? 'Evaluating..'
                : isRecording
                ? 'Recording...'
                : !isPaused && 'Record'}
            </button>
          </div>
        </div>
      </Modal>
    )
  )
}
