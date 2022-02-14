import '../styles/index.css'
import Loader from 'components/Loader'
import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import ErrorBoundary from '../components/ErrorBoundary'
import Polling from '../components/Header/Polling'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import initFontawesome from "./fontawesome";
import Step from "./Step";
import { PageLayout } from "../components/Layout";

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
          <Popups />
          <Polling />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/' element={<PageLayout />}>
                <Route path='step/*' element={<Step />} />
              </Route>
            </Routes>
          </Suspense>
        </>
      </Web3ReactManager>
    </ErrorBoundary>
  )
}
