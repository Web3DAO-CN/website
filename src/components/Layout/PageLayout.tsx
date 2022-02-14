import Footer from 'components/Footer'
import Header from 'components/Header'
import { Outlet } from 'react-router-dom'

export default function PageLayout() {
  return (
    <div className="flex flex-col justify-between">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
