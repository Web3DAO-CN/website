import { Donate, ExchangeAlt, HandHoldingDroplet, LayerGroup, PiggyBank, ShoppingCart } from 'components/FontawesomeIcon'
import { NavLink } from 'react-router-dom'
import classNames from '../../../../utils/classNames'

const navigation = [
  {
    name: '购买WETH(仅测试)',
    href: '#',
    icon: <ExchangeAlt />,
    path: '/buyWETH'
  },
  {
    name: '个人中心',
    href: '#',
    icon: <ShoppingCart />,
    path: '/buyNFT'
  },
  {
    name: '赞助DAO',
    href: '#',
    icon: <Donate />,
    path: '/sponsor'
  },
  {
    name: '借出GAS',
    href: '#',
    icon: <HandHoldingDroplet />,
    path: '/borrowGas'
  },
  {
    name: '归还GAS',
    href: '#',
    icon: <PiggyBank />,
    path: '/returnGas'
  },
  {
    name: '参考布局',
    href: '#',
    icon: <LayerGroup />,
    path: '/demoLayout'
  }
]

export default function Left() {

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
