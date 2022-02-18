import useCurrencyBalance from '../../../lib/hooks/useCurrencyBalance'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { Trans } from '@lingui/macro'
import Left from '../component/Left'
import Right from '../component/Right'
import Body from '../component/Body'
import { useDaoTreasury } from '../../../hooks/useContract'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useCallback, useMemo, useState } from 'react'
import { ButtonPrimary } from 'components/Button'
import { calculateGasMargin } from '../../../utils/calculateGasMargin'
import { TransactionResponse } from '@ethersproject/providers'
import { TransactionType } from '../../../state/transactions/actions'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { shortenAddress } from '../../../utils'
import { popupToastError } from '../../../components/Popups/PopupToast'
import { DEFAULT_TXN_DISMISS_MS } from '../../../constants/misc'
import { ApprovalState } from '../../../lib/hooks/useApproval'
import { useApproveCallback } from '../../../hooks/useApproveCallback'
import { DAO_TREASURY_ADDRESSES } from '../../../constants/addresses'
import { Dots } from 'components/Dots'
import { ExternalLinkAlt } from '../../../components/FontawesomeIcon'
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink'
import ExternalLink from '../../../lib/components/ExternalLink'
import { useTokenIdsByOwner } from '../../../hooks/contract/useWeb3DAOCNContract'
import { VALUATION_TOKEN } from '../../../constants/web3dao'
import { useERC20CurrencyAmountForTypeInput } from '../../../lib/hooks/useNativeCurrency'
import useDebounce from '../../../hooks/useDebounce'

export default function Sponsor() {

  const { account, library, chainId } = useActiveWeb3React()

  const ownTokenIds = useTokenIdsByOwner(account)
  console.log('ownTokenIds = %s', JSON.stringify(ownTokenIds))

  const valuationToken = chainId ? VALUATION_TOKEN[chainId] : undefined

  const userValuationTokenBalance = useCurrencyBalance(account ?? undefined, valuationToken)

  const [amountInput, setAmountInput] = useState<string>('')
  const debouncedAmountInput = useDebounce(amountInput, 200)

  const amountInputCurrencyAmount = useERC20CurrencyAmountForTypeInput(debouncedAmountInput, userValuationTokenBalance?.currency)

  const daoTreasuryAddress = useMemo(() => {
    return chainId ? DAO_TREASURY_ADDRESSES[chainId] : undefined
  }, [chainId])

  const [approval, approveCallback] = useApproveCallback(userValuationTokenBalance, daoTreasuryAddress)

  async function onAttemptToApprove() {
    await approveCallback()
  }

  const handleMaxInput = useCallback(() => {
    setAmountInput(userValuationTokenBalance ? userValuationTokenBalance?.toExact() : '')
  }, [userValuationTokenBalance])

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
      Sponsor {amountInputCurrencyAmount?.toExact()} {amountInputCurrencyAmount?.currency.symbol} for tokenId {ownTokenIds?.[0]}
    </Trans>
  )

  function modalHeader() {
    return (
      <div className='bg-white shadow sm:rounded-lg m-4'>
        <div className='px-4 py-5 sm:p-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            You will sponsor
          </h3>
          <div className='mt-5'>
            <div className='rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between'>
              <div className='sm:flex sm:items-start'>
                {amountInputCurrencyAmount?.currency.symbol}
                <div className='mt-3 sm:mt-0 sm:ml-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {amountInputCurrencyAmount?.toExact()}
                  </div>
                  <div className='mt-1 text-sm text-gray-600 sm:flex sm:items-center'>
                    <div className='mt-1 sm:mt-0'>
                      <Trans>For tokenId {ownTokenIds?.[0]}</Trans>
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
        <ButtonPrimary disabled={!userValuationTokenBalance?.greaterThan(0)} onClick={onSponsor}>
          <span className='text-lg font-semibold'>
            <Trans>Confirm</Trans>
          </span>
        </ButtonPrimary>
      </>
    )
  }

  const daoTreasuryContract = useDaoTreasury()

  async function onSponsor() {
    if (!chainId
      || !library
      || !amountInputCurrencyAmount
      || !(ownTokenIds && ownTokenIds.length > 0)
      || !daoTreasuryContract)
      throw new Error('missing dependencies')

    if (!amountInputCurrencyAmount?.greaterThan(0)) {
      throw new Error('missing currency amounts')
    }
    //
    const methodNames: string[] = ['sponsor']
    const args: Array<string | BigNumber> =
      [
        ownTokenIds[0],
        BigNumber.from(amountInputCurrencyAmount.quotient.toString())
      ]
    //
    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        daoTreasuryContract.estimateGas[methodName](...args)
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
      await daoTreasuryContract[methodName](...args, {
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

    <Body>

      <Left />

      <Right>

        <TransactionConfirmationModal
          isOpen={showConfirm}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash ? txHash : ''}
          content={() => (
            <ConfirmationModalContent
              title={<Trans>Confirm Detail</Trans>}
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
                  //TODO: 待修改
                  ownTokenIds && ownTokenIds.length > 0
                    ?
                    <div className='col-span-3'>
                      <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        NFT TokenId
                      </label>
                      <p className='mt-2 text-sm text-gray-500'>
                        {
                          ownTokenIds.join(' , ')
                        }
                      </p>
                    </div>
                    : null
                }

                {
                  chainId && daoTreasuryAddress
                    ?
                    <div className='col-span-3'>
                      <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        WEB3DAO金库合约地址
                      </label>
                      <p className='mt-2 text-sm text-gray-500'>
                        {
                          <ExternalLink href={getExplorerLink(chainId, daoTreasuryAddress, ExplorerDataType.ADDRESS)}>
                            {shortenAddress(daoTreasuryAddress)}
                            <ExternalLinkAlt className='ml-1' />
                          </ExternalLink>
                        }
                      </p>
                    </div>
                    : null
                }

                <div className='col-span-3'>
                  <label htmlFor='about' className='block text-sm font-medium text-gray-700'>
                    输入您赞助的资金
                  </label>
                  <p className='mt-2 text-sm text-gray-500'>
                    <input
                      type='text'
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      value={amountInput}
                      onChange={(e) => {
                        setAmountInput(e.target.value)
                      }}
                    />
                  </p>
                </div>

                {
                  userValuationTokenBalance
                    ?
                    <div className='col-span-3'>
                      <label onClick={handleMaxInput} htmlFor='about' className='block text-sm font-medium text-gray-700'>
                        <Trans>Balance: {userValuationTokenBalance?.toSignificant(3)}</Trans> {valuationToken?.symbol}
                      </label>
                    </div>
                    : null
                }
              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              {
                approval !== ApprovalState.APPROVED && userValuationTokenBalance?.greaterThan(0)
                  ? <button
                    disabled={approval !== ApprovalState.NOT_APPROVED || !userValuationTokenBalance?.greaterThan(0)}
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
                disabled={
                  approval !== ApprovalState.APPROVED
                  || (!userValuationTokenBalance?.greaterThan(0) || amountInputCurrencyAmount?.greaterThan(userValuationTokenBalance))
                  || !amountInputCurrencyAmount?.greaterThan(0)
                  || !(ownTokenIds && ownTokenIds.length > 0)
                }
                type='button'
                className='bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30 ml-2'
                onClick={() => {
                  setShowConfirm(true)
                }}
              >
                {
                  (!userValuationTokenBalance?.greaterThan(0) || amountInputCurrencyAmount?.greaterThan(userValuationTokenBalance))
                    ? <Trans>Insufficient {userValuationTokenBalance?.currency.symbol} balance</Trans>
                    : !amountInputCurrencyAmount?.greaterThan(0)
                      ? <Trans>Enter an amount</Trans>
                      : !(ownTokenIds && ownTokenIds.length > 0)
                        ? <Trans>您尚未购买NFT</Trans>
                        : <Trans>赞助</Trans>
                }
              </button>

            </div>
          </div>
        </form>

      </Right>

    </Body>
  )
}
