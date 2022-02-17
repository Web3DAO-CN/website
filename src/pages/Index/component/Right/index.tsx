import { ReactNode } from 'react'

export default function Right({ children }: { children: ReactNode }) {

  return (
    <div className='space-y-6 sm:px-6 lg:px-0 lg:col-span-9'>
      {children}
    </div>
  )
}
