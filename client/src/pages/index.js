import Head from 'next/head'

import Navbar from '@/components/navbar/index'
import Sidebar from '@/components/sidebar/index'
import Main from '@/components/home/index'

import Modal from '@/components/modal'

export default function Home() {
  return (
    <>
      <Head>
        <title>Rewind</title>
        <meta name='description' content='Rewind' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/logo.svg' />
      </Head>
      <div>
        <div className='flex h-screen'>
          <Navbar />
          <Main />
          <Sidebar />
        </div>
      </div>
    </>
  )
}
