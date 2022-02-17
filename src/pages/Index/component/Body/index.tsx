import { ReactNode } from 'react'

export default function Aside({ children }: { children: ReactNode }) {

  return (
    <div className='lg:grid lg:grid-cols-12 lg:gap-x-2 lg:gap-y-2 p-4'>
      {children}
    </div>
  )
}
