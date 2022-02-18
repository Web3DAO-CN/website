import useCurrencyBalance, { useNativeCurrencyBalances } from '../../../lib/hooks/useCurrencyBalance'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { useCallback, useMemo, useState } from 'react'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import NumericalInput from 'components/NumericalInput'
import { useERC20CurrencyAmountForTypeInput } from '../../../lib/hooks/useNativeCurrency'
import { Trans } from '@lingui/macro'
import { Repeat } from '../../../components/FontawesomeIcon'
import Left from '../component/Left'
import Body from '../component/Body'
import Right from '../component/Right'
import { VALUATION_TOKEN } from '../../../constants/web3dao'
import { useTransaction, useTransactionAdder } from '../../../state/transactions/hooks'
import { ButtonPrimary } from '../../../components/Button'
import { useValuationTokenContract } from '../../../hooks/useContract'
import { BigNumber } from '@ethersproject/bignumber'
import { calculateGasMargin } from '../../../utils/calculateGasMargin'
import { TransactionResponse } from '@ethersproject/providers'
import { TransactionType } from '../../../state/transactions/actions'
import { popupToastError } from '../../../components/Popups/PopupToast'
import { DEFAULT_TXN_DISMISS_MS } from '../../../constants/misc'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../../components/TransactionConfirmationModal'

export default function BuyWETH() {

  const { account, chainId, library } = useActiveWeb3React()

  //存，取
  const [depositWithdraw, setDepositWithdraw] = useState<boolean>(true)

  const valuationToken = useMemo(() => {
    return chainId ? VALUATION_TOKEN[chainId] : undefined
  }, [chainId])

  const userValuationTokenBalance = useCurrencyBalance(account ?? undefined, valuationToken)

  const userNativeTokenBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  const [amountInput, setAmountInput] = useState<string>('')
  const amountInputCurrencyAmount = useERC20CurrencyAmountForTypeInput(
    amountInput,
    depositWithdraw
      ? userNativeTokenBalance?.currency
      : userValuationTokenBalance?.currency
  )

  const handleMaxInput = useCallback(() => {
    //console.log('userEthBalance = %s', userEthBalance?.toExact())
    let maxAmountSpendCurrencyAmount
    if (depositWithdraw) {
      maxAmountSpendCurrencyAmount = maxAmountSpend(userNativeTokenBalance)
    } else {
      maxAmountSpendCurrencyAmount = userValuationTokenBalance
    }
    //console.log('maxAmountSpendCurrencyAmount = %s', maxAmountSpendCurrencyAmount?.toExact())
    setAmountInput(maxAmountSpendCurrencyAmount ? maxAmountSpendCurrencyAmount.toExact() : '')
  }, [userNativeTokenBalance, userValuationTokenBalance, depositWithdraw])

  const toggleWrap = useCallback(() => {
    setAmountInput('')
    setDepositWithdraw(!depositWithdraw)
  }, [setDepositWithdraw, depositWithdraw])

  //合约交互
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState(false) // clicked confirm
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const addTransaction = useTransactionAdder()

  const transaction = useTransaction(txHash)
  const transactionSuccess = transaction?.receipt?.status === 1

  if (transactionSuccess) {
    setTxHash('')
    setShowConfirm(false)
    setAmountInput('')
  }

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    setTxHash('')
  }, [])

  const pendingText = (
    <Trans>
      {depositWithdraw ? ' Deposit' : ' Withdraw'} {userNativeTokenBalance?.currency.symbol}
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
                {amountInputCurrencyAmount?.currency.symbol}
                <div className='mt-3 sm:mt-0 sm:ml-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {amountInputCurrencyAmount?.toExact()}
                  </div>
                  <div className='mt-1 text-sm text-gray-600 sm:flex sm:items-center'>
                    <div className='mt-1 sm:mt-0'>
                      <Trans>Will receive {amountInputCurrencyAmount?.toSignificant(3)} {depositWithdraw ? valuationToken?.symbol : userNativeTokenBalance?.currency.symbol}</Trans>
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
        <ButtonPrimary disabled={!amountInputCurrencyAmount?.greaterThan(0)} onClick={handle}>
          <span className='text-lg font-semibold'>
            <Trans>Confirm</Trans>
          </span>
        </ButtonPrimary>
      </>
    )
  }

  const valuationTokenContract = useValuationTokenContract()

  async function handle() {
    if (!chainId
      || !library
      || !valuationTokenContract)
      throw new Error('missing dependencies')

    if (!amountInputCurrencyAmount?.greaterThan(0)) {
      throw new Error('missing currency amounts')
    }
    //
    // const methodNames: string[] = [depositWithdraw ? 'deposit' : 'withdraw']

    let estimate, method: (...args: any) => Promise<TransactionResponse>
    let args: any[] = []
    let value: BigNumber | null
    if (depositWithdraw) {
      estimate = valuationTokenContract.estimateGas.deposit
      method = valuationTokenContract.deposit
      args = []
      value = BigNumber.from(amountInputCurrencyAmount?.quotient.toString())
    } else {
      estimate = valuationTokenContract.estimateGas.withdraw
      method = valuationTokenContract.withdraw
      args = [BigNumber.from(amountInputCurrencyAmount?.quotient.toString())]
      value = null
    }

    setAttemptingTxn(true)
    // @ts-ignore
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            type: TransactionType.BUY_WETH,
            currencyAmountExact: amountInputCurrencyAmount?.toExact(),
            depositWithdraw,
            symbol: userNativeTokenBalance?.currency.symbol
          })

          setTxHash(response.hash)

        })
      )
      .catch((error) => {
        const msg = error?.data?.message ? error.data.message : error?.message ? error.message : error.reason
        popupToastError({ message: msg, removeAfterMs: DEFAULT_TXN_DISMISS_MS })
        //
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })

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

                <div className='col-span-3'>
                  <label className='block text-sm font-medium text-gray-700'>
                    兑换数额
                  </label>
                  <div className='mt-1'>
                    <NumericalInput
                      className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                      value={amountInput}
                      onUserInput={(value: string) => {
                        setAmountInput(value)
                      }}
                      placeholder={'输入数额'}
                    />
                  </div>
                  {
                    userNativeTokenBalance && userValuationTokenBalance
                      ?
                      <div className='mt-2 text-sm text-gray-500 flex justify-between items-center'>
                        <div onClick={handleMaxInput} className='text-blue-600'>
                          <Trans>Balance: {depositWithdraw ? userNativeTokenBalance?.toSignificant(4) : userValuationTokenBalance?.toSignificant(4)}</Trans>
                          &nbsp;
                          {
                            depositWithdraw
                              ? userNativeTokenBalance?.currency.symbol
                              : userValuationTokenBalance?.currency.symbol
                          }
                        </div>
                        <div onClick={toggleWrap} className='text-blue-500'>
                          <Repeat />
                        </div>
                      </div>
                      : null
                  }
                </div>

              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              <button
                disabled={
                  (depositWithdraw && !userNativeTokenBalance?.greaterThan(0))
                  || (!depositWithdraw && !userValuationTokenBalance?.greaterThan(0))
                }
                type='button'
                className='bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30'
                onClick={() => {
                  setShowConfirm(true)
                }}
              >
                {
                  !amountInputCurrencyAmount?.greaterThan(0)
                    ? <Trans>Enter an amount</Trans>
                    : depositWithdraw
                      ? <Trans>Wrap</Trans>
                      : <Trans>Unwrap</Trans>
                }

              </button>

            </div>
          </div>
        </form>

      </Right>

    </Body>
  )
}
