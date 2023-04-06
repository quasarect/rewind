import Link from 'next/link'

export default function NavItem({ link, name, children }) {
  return (
    <li>
      <Link
        href={link}
        className='w-full h-10 flex items-center my-2 text-white text text-xl'
      >
        {children}
        <span className='ml-2'>{name}</span>
      </Link>
    </li>
  )
}
