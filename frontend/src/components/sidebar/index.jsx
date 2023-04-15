export default function Sidebar() {
  return (
    <>
      <div className='hidden lg:block lg:w-1/5 '></div>

      <div className='w-1/5 h-screen hidden lg:block fixed right-0 top-0'>
        <aside className='flex w-full h-full bg-rewind-dark-primary flex-col items-end border-l border-rewind-dark-tertiary'></aside>
      </div>
    </>
  )
}
