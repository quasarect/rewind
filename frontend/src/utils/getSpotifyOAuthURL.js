export default () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const CALLBACK_URL = encodeURIComponent(
    import.meta.env.VITE_SPOTIFY_CALLBACK_URL
  )

  const scopes = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-top-read',
  ]

  const scope = scopes.join('%20')

  const URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${CALLBACK_URL}`

  return URL
}
