import { CreditCard, ExchangeAlt, LayerGroup, ShoppingCart } from 'components/FontawesomeIcon'
import { NavLink } from 'react-router-dom'
import classNames from '../../../../utils/classNames'

const navigation = [
  {
    id: 1,
    name: '母币兑换',
    href: '#',
    icon: <ExchangeAlt />,
    path: '/wrapToken'
  },
  {
    id: 2,
    name: '授权W母币',
    href: '#',
    icon: <CreditCard />,
    path: '/approveWrapToken'
  },
  {
    id: 3,
    name: '购买',
    href: '#',
    icon: <ShoppingCart />,
    path: '/buyNFT'
  },
  {
    id: 9,
    name: '参考布局',
    href: '#',
    icon: <LayerGroup />,
    path: '/demoLayout'
  }
]

export default function LeftAside() {

  return (
    <aside className='py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3'>
      <nav className='space-y-1'>
        {navigation.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              classNames(
                isActive
                  ? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white'
                  : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
              )
            }
          >
            {item.icon}&nbsp;{item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
