export default () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const CALLBACK_URL = encodeURIComponent(
    import.meta.env.VITE_SPOTIFY_CALLBACK_URL
  )

  const URL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user-read-private%20user-read-email&redirect_uri=${CALLBACK_URL}`

  return URL
}
