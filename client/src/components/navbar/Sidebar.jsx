import Image from 'next/image'
import Link from 'next/link'

export default function Sidebar({ navItems }) {
  return (
    <nav className='hidden md:flex w-1/5 h-screen bg-rewind-dark-primary flex-col items-end border-r border-rewind-dark-tertiary'>
      {/* below div is for responsive layout  */}
      <div className='w-full h-screen lg:w-4/5 flex flex-col justify-between'>
        {/* the logo div  */}
        <div className='w-full flex items-center mt-10'>
          <Image src='/logo.svg' alt='Rewind Logo' width={50} height={50} />
        </div>
        {/* the nav items  */}
        <ul className='h-full py-10'>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.link}
                className='w-full h-10 flex items-center my-2 text text-xl hover:text-rewind-secondary'
              >
                <item.icon />
                <span className='ml-2 text-white'>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        {/* copyright */}
        <div className='w-full lg:w-4/5 text-ubuntu text-white text-sm text-poppins mb-4'>
          © 2023 Rewind.io
        </div>
      </div>
    </nav>
  )
}
