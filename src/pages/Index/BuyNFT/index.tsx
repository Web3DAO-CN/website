import useCurrencyBalance from '../../../lib/hooks/useCurrencyBalance'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { WRAPPED_NATIVE_CURRENCY } from '../../../constants/tokens'
import { Trans } from '@lingui/macro'
import LeftAside from '../component/LeftAside'
import RightContents from '../component/RightContents'
import BodyWrapper from '../component/BodyWrapper'
import { useBuyNFTContract } from '../../../hooks/useContract'
import { useBuyNFTPrice } from '../../../hooks/useBuyNFTContract'
import { useERC20CurrencyAmount } from '../../../lib/hooks/useNativeCurrency'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ButtonPrimary } from 'components/Button'
import { calculateGasMargin } from '../../../utils/calculateGasMargin'
import { TransactionResponse } from '@ethersproject/providers'
import { TransactionType } from '../../../state/transactions/actions'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { isAddress, shortenAddress } from '../../../utils'
import { popupToastError } from '../../../components/Popups/PopupToast'
import { DEFAULT_TXN_DISMISS_MS } from '../../../constants/misc'
import usePrevious from '../../../hooks/usePrevious'
import { ApprovalState } from '../../../lib/hooks/useApproval'
import { useApproveCallback } from '../../../hooks/useApproveCallback'
import { BuyNFT } from '../../../constants/addresses'
import { Dots } from 'components/Dots'
import { ExternalLinkAlt } from '../../../components/FontawesomeIcon'
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink'
import ExternalLink from '../../../lib/components/ExternalLink'

export default function ApproveWrapToken() {

  const { account, library, chainId } = useActiveWeb3React()
  const lastAccount = usePrevious(account)

  const [nftReceiver, setNFTReceiver] = useState<string>('')
  useEffect(() => {
    if ((account || account !== lastAccount) && isAddress(account)) {
      setNFTReceiver(account ?? '')
    } else {
      setNFTReceiver('')
    }
  }, [lastAccount, account])

  const wrappedNativeCurrency = chainId ? WRAPPED_NATIVE_CURRENCY[chainId] : undefined

  const userWrappedNativeTokenBalance = useCurrencyBalance(account ?? undefined, wrappedNativeCurrency)

  const nftPrice = useBuyNFTPrice()
  const nftPriceCurrencyAmount = useERC20CurrencyAmount(nftPrice, wrappedNativeCurrency)

  //console.log('nftPriceCurrencyAmount = %s', nftPriceCurrencyAmount?.toExact())

  const buyNFTAddress = useMemo(() => {
    return chainId ? BuyNFT[chainId] : undefined
  }, [chainId])

  const [approval, approveCallback] = useApproveCallback(userWrappedNativeTokenBalance, buyNFTAddress)

  async function onAttemptToApprove() {
    await approveCallback()
  }

  //合约交互
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const addTransaction = useTransactionAdder()

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setTxHash('')
  }, [])

  const pendingText = (
    <Trans>
      Buy NFT
    </Trans>
  )

  function modalHeader() {
    return (
      <div className='bg-white shadow sm:rounded-lg m-4'>
        <div className='px-4 py-5 sm:p-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            You will pay
          </h3>
          <div className='mt-5'>
            <div className='rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between'>
              <div className='sm:flex sm:items-start'>
                {userWrappedNativeTokenBalance?.currency.symbol}
                <div className='mt-3 sm:mt-0 sm:ml-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {nftPriceCurrencyAmount?.toExact()}
                  </div>
                  <div className='mt-1 text-sm text-gray-600 sm:flex sm:items-center'>
                    <div className='mt-1 sm:mt-0'>
                      <Trans>{shortenAddress(nftReceiver)} will receive NFT</Trans>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0'>
                <button
                  type='button'
                  className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm'
                  onClick={() => {
                    setShowConfirm(false)
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function modalBottom() {
    return (
      <>
        <ButtonPrimary disabled={!userWrappedNativeTokenBalance?.greaterThan(0)} onClick={onBuy}>
          <span className='text-lg font-semibold'>
            <Trans>Confirm</Trans>
          </span>
        </ButtonPrimary>
      </>
    )
  }

  const buyNFTContract = useBuyNFTContract()

  async function onBuy() {
    if (!chainId
      || !library
      || !nftReceiver
      || !buyNFTContract)
      throw new Error('missing dependencies')

    if (!userWrappedNativeTokenBalance?.greaterThan(0)) {
      throw new Error('missing currency amounts')
    }
    //
    const methodNames: string[] = ['buy']
    const args: Array<string | string[] | number | boolean> = [nftReceiver]
    //
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        buyNFTContract.estimateGas[methodName](...args)
          .then((estimateGas) => calculateGasMargin(estimateGas))
          .catch((error) => {
            console.error(`estimateGas failed`, methodName, args, error)
            const msg = error?.data?.message ? error.data.message : error?.message ? error.message : error.reason
            popupToastError({ message: msg, removeAfterMs: DEFAULT_TXN_DISMISS_MS })
            return undefined
          })
      )
    )
    //
    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate)
    )
    //
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail. Please contact support.')
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setAttemptingTxn(true)
      await buyNFTContract[methodName](...args, {
        gasLimit: safeGasEstimate
      })
        .then((response: TransactionResponse) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            type: TransactionType.BUY_NFT
          })

          setTxHash(response.hash)
        })
        .catch((error: Error) => {
          setAttemptingTxn(false)
          console.error(error)
        })
    }
  }

  return (

    <BodyWrapper>

      <LeftAside />

      <RightContents>

        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash ? txHash : ''}
          content={() => (
            <ConfirmationModalContent
              title={<Trans>Confirm Buy Detail</Trans>}
              onDismiss={handleDismissConfirmation}
              topContent={modalHeader}
              bottomContent={modalBottom}
            />
          )}
          pendingText={pendingText}
        />

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

                {
                  nftPriceCurrencyAmount && nftPriceCurrencyAmount.greaterThan(0)
                    ?
                    <div className='col-span-3'>
                      <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        NFT价格
                      </label>
                      <p className='mt-2 text-sm text-gray-500'>
                        {nftPriceCurrencyAmount?.toExact()} {nftPriceCurrencyAmount?.currency.symbol}
                      </p>
                    </div>
                    : null
                }

                {
                  chainId && buyNFTAddress
                    ?
                    <div className='col-span-3'>
                      <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        NFT交易合约
                      </label>
                      <p className='mt-2 text-sm text-gray-500'>
                        {
                          <ExternalLink href={getExplorerLink(chainId, buyNFTAddress, ExplorerDataType.ADDRESS)}>
                            {shortenAddress(buyNFTAddress)}
                            <ExternalLinkAlt className='ml-1' />
                          </ExternalLink>
                        }
                      </p>
                    </div>
                    : null
                }

                <div className='col-span-3'>
                  <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                    NFT接收地址
                  </label>
                  <p className='mt-2 text-sm text-gray-500'>
                    <input
                      type='text'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      value={nftReceiver}
                      onChange={(e) => {
                        setNFTReceiver(e.target.value)
                      }}
                    />
                  </p>
                </div>

                {
                  userWrappedNativeTokenBalance
                    ?
                    <div className='col-span-3'>
                      <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        <Trans>Balance: {userWrappedNativeTokenBalance?.toSignificant(3)}</Trans> {wrappedNativeCurrency?.symbol}
                      </label>
                    </div>
                    : null
                }
              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              {
                approval !== ApprovalState.APPROVED && userWrappedNativeTokenBalance?.greaterThan(0)
                  ? <button
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
                        : <Trans>Approve</Trans>
                    }
                  </button>
                  : null
              }

              <button
                disabled={approval !== ApprovalState.APPROVED || !userWrappedNativeTokenBalance?.greaterThan(0) || !nftReceiver || !isAddress(nftReceiver)}
                type='button'
                className='bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30 ml-2'
                onClick={() => {
                  setShowConfirm(true)
                }}
              >
                {
                  !isAddress(nftReceiver)
                    ? 'NFT接收地址，格式不正确'
                    : userWrappedNativeTokenBalance?.greaterThan(0)
                      ? <Trans>购买</Trans>
                      : <Trans>Insufficient {userWrappedNativeTokenBalance?.currency.symbol} balance</Trans>
                }
              </button>

            </div>
          </div>
        </form>

      </RightContents>

    </BodyWrapper>
  )
}
