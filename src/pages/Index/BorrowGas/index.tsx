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
import { useTransaction, useTransactionAdder } from '../../../state/transactions/hooks'
import { shortenAddress } from '../../../utils'
import { popupToastError } from '../../../components/Popups/PopupToast'
import { DEFAULT_TXN_DISMISS_MS } from '../../../constants/misc'
import { DAO_TREASURY_ADDRESSES, WEB3_DAO_CN_ADDRESSES } from '../../../constants/addresses'
import { ExternalLinkAlt } from '../../../components/FontawesomeIcon'
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink'
import ExternalLink from '../../../lib/components/ExternalLink'
import { useTokenIdsByOwner } from '../../../hooks/contract/useWeb3DAOCNContract'
import { AttrIdEnum, GAS_TOKEN, SPONSOR_TOKEN } from '../../../constants/web3dao'
import { useERC20CurrencyAmount, useERC20CurrencyAmountForTypeInput } from '../../../lib/hooks/useNativeCurrency'
import useDebounce from '../../../hooks/useDebounce'
import { useAvailableBorrowGas, useLockVault } from '../../../hooks/contract/useDaoSponsorContract'
import CountdownExt from '../../../components/CountdownExt'
import { useTotalSupplyByAttrId } from '../../../hooks/contract/useERC2664Contract'

export default function BorrowGas() {

  const { account, library, chainId } = useActiveWeb3React()

  const ownTokenIds = useTokenIdsByOwner(account)
  //console.log('ownTokenIds = %s', JSON.stringify(ownTokenIds))

  const gasToken = chainId ? GAS_TOKEN[chainId] : undefined
  const sponsorToken = chainId ? SPONSOR_TOKEN[chainId] : undefined

  const lockVault = useLockVault(ownTokenIds[0])
  //console.log('lockVault = %s', JSON.stringify(lockVault))

  //锁仓时间
  const lockTimeMilliseconds = lockVault ? lockVault.time.toNumber() * 1000 : 0

  //赞助
  const sponsorAmountCurrencyAmount = useERC20CurrencyAmount(lockVault?.sponsorAmount.toString(), sponsorToken)

  //已借
  const borrowGasAmountCurrencyAmount = useERC20CurrencyAmount(lockVault?.borrowGasAmount.toString(), gasToken)

  //股份
  const stakeAmountCurrencyAmount = useERC20CurrencyAmount(lockVault?.stakeAmount.toString(), gasToken)

  //可借出GAS
  const availableBorrowGasCurrencyAmount = useAvailableBorrowGas(ownTokenIds[0])

  //gas总供应
  const gasTotalSupply = useTotalSupplyByAttrId(AttrIdEnum.gas, chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined)
  const gasTotalSupplyCurrencyAmount = useERC20CurrencyAmount(gasTotalSupply?.toString(), gasToken)

  const [amountInput, setAmountInput] = useState<string>('')
  const debouncedAmountInput = useDebounce(amountInput, 200)
  const amountInputCurrencyAmount = useERC20CurrencyAmountForTypeInput(debouncedAmountInput, gasToken)

  const daoTreasuryAddress = useMemo(() => {
    return chainId ? DAO_TREASURY_ADDRESSES[chainId] : undefined
  }, [chainId])

  //const [approval, approveCallback] = useApproveCallback(userValuationTokenBalance, daoTreasuryAddress)

  // async function onAttemptToApprove() {
  //   await approveCallback()
  // }

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
      Borrowing {amountInputCurrencyAmount?.toExact()} {amountInputCurrencyAmount?.currency.symbol}
    </Trans>
  )

  function modalHeader() {
    return (
      <div className='bg-white shadow sm:rounded-lg m-4'>
        <div className='px-4 py-5 sm:p-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            You will borrow
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
                      <Trans>Will receive {amountInputCurrencyAmount?.toSignificant(3)} {amountInputCurrencyAmount?.currency.symbol}</Trans>
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
        <ButtonPrimary disabled={!amountInputCurrencyAmount?.greaterThan(0)} onClick={onBuy}>
          <span className='text-lg font-semibold'>
            <Trans>Confirm</Trans>
          </span>
        </ButtonPrimary>
      </>
    )
  }

  const treasuryContract = useDaoTreasury()

  async function onBuy() {
    if (!chainId
      || !library
      || !ownTokenIds?.[0]
      || !treasuryContract)
      throw new Error('missing dependencies')

    if (!amountInputCurrencyAmount?.greaterThan(0)) {
      throw new Error('missing currency amounts')
    }
    //
    // const methodNames: string[] = [depositWithdraw ? 'deposit' : 'withdraw']

    const estimate = treasuryContract.estimateGas.borrowGas
    const method: (...args: any) => Promise<TransactionResponse> = treasuryContract.borrowGas
    const args = [ownTokenIds[0], amountInputCurrencyAmount?.quotient.toString()]
    const value = null

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
            type: TransactionType.BORROW_GAS,
            currencyAmountExact: amountInputCurrencyAmount?.toExact(),
            symbol: amountInputCurrencyAmount?.currency.symbol
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
              </div>

              <div className='grid grid-cols-6 gap-6'>

                {
                  lockTimeMilliseconds && lockTimeMilliseconds > 0
                    ?
                    <div className='col-span-6 sm:col-span-3'>
                      <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                        锁仓时间
                      </label>
                      <CountdownExt small={true} milliseconds={lockTimeMilliseconds} />
                    </div>
                    : null
                }

                {
                  sponsorAmountCurrencyAmount
                    ?
                    <div className='col-span-6 sm:col-span-3'>
                      <label htmlFor='last-name' className='block text-sm font-medium text-gray-700'>
                        赞助总额
                      </label>
                      {sponsorAmountCurrencyAmount.toExact()} {sponsorAmountCurrencyAmount.currency.symbol}
                    </div>
                    : null
                }

                {
                  borrowGasAmountCurrencyAmount
                    ?
                    <div className='col-span-6 sm:col-span-3'>
                      <label htmlFor='first-name' className='block text-sm font-medium text-gray-700'>
                        已借
                      </label>
                      {borrowGasAmountCurrencyAmount.toExact()} {borrowGasAmountCurrencyAmount.currency.symbol}
                    </div>
                    : null
                }

                {
                  stakeAmountCurrencyAmount
                    ?
                    <div className='col-span-6 sm:col-span-3'>
                      <label htmlFor='last-name' className='block text-sm font-medium text-gray-700'>
                        抵押
                      </label>
                      {stakeAmountCurrencyAmount.toExact()} {stakeAmountCurrencyAmount.currency.symbol}
                    </div>
                    : null
                }

                <div className='col-span-12 sm:col-span-6'>
                  <label htmlFor='last-name' className='block text-sm font-medium text-gray-700'>
                    输入借出GAS额度
                  </label>
                  <input
                    type='text'
                    className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value)
                    }}
                  />
                </div>

                {
                  availableBorrowGasCurrencyAmount && gasTotalSupplyCurrencyAmount
                    ?
                    <div className='col-span-12 sm:col-span-6'>
                      <label htmlFor='last-name' className='block text-sm font-medium text-gray-700 flex justify-between'>
                        <div>
                          <Trans>还可借: {availableBorrowGasCurrencyAmount?.toExact()}</Trans> {availableBorrowGasCurrencyAmount?.currency.symbol}
                        </div>
                        <div>
                          <Trans>总供应: {gasTotalSupplyCurrencyAmount?.toExact()}</Trans> {gasTotalSupplyCurrencyAmount?.currency.symbol}
                        </div>
                      </label>
                    </div>
                    : null
                }

              </div>

            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              {/*{
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
              }*/}

              <button
                disabled={
                  (!availableBorrowGasCurrencyAmount?.greaterThan(0) || amountInputCurrencyAmount?.greaterThan(availableBorrowGasCurrencyAmount))
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
                  (!availableBorrowGasCurrencyAmount?.greaterThan(0) || amountInputCurrencyAmount?.greaterThan(availableBorrowGasCurrencyAmount))
                    ? <Trans>Insufficient {availableBorrowGasCurrencyAmount?.currency.symbol} balance</Trans>
                    : !amountInputCurrencyAmount?.greaterThan(0)
                      ? <Trans>Enter an amount</Trans>
                      : !(ownTokenIds && ownTokenIds.length > 0)
                        ? <Trans>您尚未购买NFT</Trans>
                        : <Trans>借出</Trans>
                }
              </button>

            </div>

          </div>
        </form>

      </Right>

    </Body>
  )
}
