import getSpotifyOAuthURL from '../utils/getSpotifyOAuthURL'

import SpotifySVG from '../components/assets/spotify.svg'

function Login() {
  const redirectURL = getSpotifyOAuthURL()

  return (
    <div className='h-screen w-screen  bg-rewind-dark-primary flex items-center justify-center flex-col'>
      <img src={SpotifySVG} className='h-48' />

      <a href={redirectURL}>
        <button className='border border-rewind-dark-tertiary rounded-full px-6 py-2 text-2xl text-white mt-4 hover:bg-gray-200 hover:text-rewind-dark-primary font-manrope  tracking-wide transition-colors'>
          Login w/ Spotify →
        </button>
      </a>
    </div>
  )
}

export default Login
