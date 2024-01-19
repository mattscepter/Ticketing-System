import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <div className='h-14 px-4 sm:px-20 md:px-24 gap-4 flex items-center fixed top-0 shadow-md w-full z-10 bg-white'>
            <Link href='/'>
                <h2 className='text-lg font-semibold text-neutral-700 hover:text-blue-800'>Tickets</h2>
            </Link>
            <Link href='/agents'>
                <h2 className='text-lg font-semibold text-neutral-700 hover:text-blue-800'>Agents</h2>
            </Link>
        </div>
    )
}

export default Navbar