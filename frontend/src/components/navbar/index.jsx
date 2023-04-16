import { useContext, useState } from 'react'

import Sidebar from './Sidebar'
import Bottom from './Bottom'

import { authContext } from '../../store/authContext'

import VoiceBot from '../voicebot/VoiceBot'

export default function Navbar() {
  const { user } = useContext(authContext)

  const [showBot, setShowBot] = useState(false)

  return (
    <>
      <Sidebar user={user} setShowBot={setShowBot} />
      <Bottom user={user} setShowBot={setShowBot} />
      <VoiceBot showBot={showBot} setShowBot={setShowBot} />
    </>
  )
}
