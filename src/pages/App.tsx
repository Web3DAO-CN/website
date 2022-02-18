import '../styles/index.css'
import Loader from 'components/Loader'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import ErrorBoundary from '../components/ErrorBoundary'
import Polling from '../components/Header/Polling'
import Web3ReactManager from '../components/Web3ReactManager'
import initFontawesome from './fontawesome'
import Index from './Index'
import IndexBuyWETH from './Index/BuyWETH'
import IndexDemoLayout from './Index/DemoLayout'
import IndexBuyNFT from './Index/BuyNFT'
import { PageLayout } from '../components/Layout'
import PopupsContainer from '../components/PopupsContainer'
import Sponsor from './Index/Sponsor'
import BorrowGas from './Index/BorrowGas'
import ReturnGas from './Index/ReturnGas'

// const AppWrapper = styled.div`
//   display: flex;
//   flex-flow: column;
//   align-items: flex-start;
// `

// const BodyWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 100%;
//   padding: 120px 16px 0px 16px;
//   align-items: center;
//   flex: 1;
//   z-index: 1;
//
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     padding: 4rem 8px 16px 8px;
//   `};
// `

// const HeaderWrapper = styled.div`
//   width: 100%;
//   justify-content: space-between;
//   position: fixed;
//   top: 0;
//   z-index: 2;
// `

// const FooterWrapper = styled.div`
//   width: 100%;
//   justify-content: space-between;
//   position: fixed;
//   bottom: 0;
//   z-index: 2;
// `

// const Marginer = styled.div`
//   margin-top: 5rem;
// `

export default function App() {

  initFontawesome()

  return (
    <ErrorBoundary>
      <Web3ReactManager>
        <>
          <Polling />
          <PopupsContainer />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/' element={<PageLayout />}>
                <Route index element={<Index />} />
                <Route path='buyWETH/*' element={<IndexBuyWETH />} />
                <Route path='demoLayout/*' element={<IndexDemoLayout />} />
                <Route path='buyNFT/*' element={<IndexBuyNFT />} />
                <Route path='sponsor/*' element={<Sponsor />} />
                <Route path='borrowGas/*' element={<BorrowGas />} />
                <Route path='returnGas/*' element={<ReturnGas />} />
                <Route path='*' />
              </Route>
            </Routes>
          </Suspense>
        </>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
