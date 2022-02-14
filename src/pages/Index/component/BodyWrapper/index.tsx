import { ReactNode } from 'react'

export default function Aside({ children }: { children: ReactNode }) {

  return (
    <div className='lg:grid lg:grid-cols-12 lg:gap-x-5 p-8'>
      {children}
    </div>
  )
}
