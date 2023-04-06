import Image from 'next/image'
import Link from 'next/link'

export default function Bottom({ navItems }) {
  return (
    <nav className='fixed bottom-0 py-4 left-0 right-0 bg-rewind-dark-primary md:hidden'>
      <ul className='flex justify-evenly items-center'>
        {navItems.map((item, index) => (
          <li key={index}>
            <Link href={item.link}>
              <Image
                src={item.icon}
                alt={item.name}
                height={25}
                width={25}
                className='text-white rounded-full'
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
