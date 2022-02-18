import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import Left from '../component/Left'
import Right from '../component/Right'
import Body from '../component/Body'
import NFTDetail from '../component/NFTDetail'
import { useTokenIdsByOwner } from '../../../hooks/contract/useWeb3DAOCNContract'

export default function BuyNFT() {

  const { account } = useActiveWeb3React()

  const ownTokenIds = useTokenIdsByOwner(account)

  return (

    <Body>

      <Left />

      <Right>

        <form action='#' method='POST'>
          <div className='shadow sm:rounded-md sm:overflow-hidden'>
            <div className='bg-white py-6 px-4 space-y-6 sm:p-6'>

              <div>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Profile</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  简介
                </p>
              </div>

              <NFTDetail tokenId={ownTokenIds?.[0]} />

            </div>

          </div>
        </form>

      </Right>

    </Body>
  )
}
