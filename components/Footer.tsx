'use client'
import React from 'react'
import { FOOTER } from '../constants'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

const Footer = () => {
    const router = useRouter()
    const pathname = usePathname()
    return (
        <>
            <div className='flex justify-between px-4 p-2 w-full bg-gray-50/5 rounded-t-lg items-center gap-2'>
                {FOOTER.map((item) =>
                    <div key={item.label} onClick={() => router.push(item.route)} className={`cursor-pointer flex justify-center items-center flex-col gap-1
                    ${(pathname === item.route ? "" : "opacity-35 scale-75")}
                    `}>
                        <item.icon size={"1.5rem"} />
                        <p className='text-xs'>{item.label}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Footer