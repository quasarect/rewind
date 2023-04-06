import Head from 'next/head'

import SpotifySVG from '@/components/assets/spotify.svg'

export default function Login() {
  return (
    <>
      <Head>
        <title>Login | Rewind</title>
        <meta name='description' content='Rewind' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo.svg' />
      </Head>
      <div className='h-screen w-screen  bg-rewind-dark-primary flex items-center justify-center flex-col'>
        <SpotifySVG className='h-48' />

        <button className='border border-rewind-dark-tertiary rounded-full px-4 py-2  text-2xl text-white mt-4 hover:bg-gray-200 hover:text-rewind-dark-primary font-lato font-semibold tracking-wide transition-colors'>
          Login w/ Spotify →
        </button>
      </div>
    </>
  )
}
