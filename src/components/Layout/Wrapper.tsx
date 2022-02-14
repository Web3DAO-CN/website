import { ReactNode } from 'react'
import classNames from 'utils/classNames'

export default function Wrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    // 屏幕宽度不足1320px时，让内容占据屏幕的90%，
    // 小屏幕上10%有足够的留白，
    // 当屏幕 >= 1466px时，
    <div
      className={classNames(
        'w-full sm:w-[90%] mx-auto max-w-[1320px]',
        'px-6 sm:px-0',
        'lg:w-[85%] xl:w-[78.5%]',
        className,
      )}
    >
      {children}
    </div>
  )
}
