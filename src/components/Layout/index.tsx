import { ReactNode } from 'react'

import PageLayout from './PageLayout'
import Wrapper from './Wrapper'

interface Container {
  children?: ReactNode
}

export function Layout({ children }: Container) {
  return (
    <div className="w-[90%] max-w-lg lg:max-w-screen-lg xl:w-[78%] xl:max-w-[1320px] mx-auto mt-8 md:mt-[60px] grid grid-cols-1 lg:grid-cols-[516fr,774fr] gap-7 min-h-screen pb-20 lg:pb-32">
      {children}
    </div>
  )
}

function Left({ children }: Container) {
  return <div>{children}</div>
}

function Right({ children }: Container) {
  return <div>{children}</div>
}

function Bottom({ children }: Container) {
  return <div className="lg:col-span-full">{children}</div>
}

Layout.Left = Left
Layout.Right = Right
Layout.Bottom = Bottom

export { PageLayout, Wrapper }
