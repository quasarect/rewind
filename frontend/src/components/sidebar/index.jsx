export default function Sidebar() {
  return (
    <>
      <div className='hidden lg:block w-2/5'></div>

      <div className='w-2/5 h-screen hidden lg:block fixed right-0 top-0'>
        <aside className='flex w-full h-full bg-rewind-dark-primary flex-col items-end border-l border-rewind-dark-tertiary'></aside>
      </div>
    </>
  )
}
