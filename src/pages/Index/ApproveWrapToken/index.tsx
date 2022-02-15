import useCurrencyBalance from '../../../lib/hooks/useCurrencyBalance'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { WRAPPED_NATIVE_CURRENCY } from '../../../constants/tokens'
import { Trans } from '@lingui/macro'
import { BuyNFT } from '../../../constants/addresses'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { Dots } from 'components/Dots'
import LeftAside from '../component/LeftAside'
import RightContents from '../component/RightContents'
import BodyWrapper from '../component/BodyWrapper'

export default function ApproveWrapToken() {

  const { account, chainId } = useActiveWeb3React()

  const wrappedNativeCurrency = chainId ? WRAPPED_NATIVE_CURRENCY[chainId] : undefined

  const userWrappedNativeTokenBalance = useCurrencyBalance(account ?? undefined, wrappedNativeCurrency)

  const [approval, approveCallback] = useApproveCallback(userWrappedNativeTokenBalance, chainId ? BuyNFT[chainId] : undefined)

  // console.log("approval = %s", approval)

  async function onAttemptToApprove() {
    await approveCallback()
  }

  return (

    <BodyWrapper>

      <LeftAside />

      <RightContents>

        <form action='#' method='POST'>
          <div className='shadow sm:rounded-md sm:overflow-hidden'>
            <div className='bg-white py-6 px-4 space-y-6 sm:p-6'>
              <div>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>Profile</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  简介
                </p>
              </div>

              <div className='grid grid-cols-3 gap-6'>

                <div className='col-span-3'>
                  <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                    授权W母币
                  </label>
                  <div className='mt-1'>
                  </div>
                  <p className='mt-2 text-sm text-gray-500'>
                    <Trans>Balance: {userWrappedNativeTokenBalance?.toSignificant(3)}</Trans> {wrappedNativeCurrency?.symbol}
                  </p>
                </div>

              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              <button
                disabled={approval !== ApprovalState.NOT_APPROVED || !userWrappedNativeTokenBalance?.greaterThan(0)}
                type='button'
                className='bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30'
                onClick={onAttemptToApprove}
              >
                {
                  approval === ApprovalState.PENDING
                    ?
                    <Dots>
                      <Trans>Approving</Trans>
                    </Dots>
                    : userWrappedNativeTokenBalance?.greaterThan(0)
                      ? <Trans>Approve</Trans>
                      : <Trans>额度不足</Trans>
                }
              </button>

            </div>
          </div>
        </form>

      </RightContents>

    </BodyWrapper>
  )
}
