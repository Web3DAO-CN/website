import useCurrencyBalance, { useNativeCurrencyBalances } from '../../../lib/hooks/useCurrencyBalance'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'
import { useCallback, useState } from 'react'
import { maxAmountSpend } from '../../../utils/maxAmountSpend'
import NumericalInput from 'components/NumericalInput'
import useWrapCallback, { WrapErrorText, WrapType } from '../../../hooks/useWrapCallback'
import { useNativeCurrencyAmountForTypeInput } from '../../../lib/hooks/useNativeCurrency'
import { WRAPPED_NATIVE_CURRENCY } from '../../../constants/tokens'
import { Trans } from '@lingui/macro'
import { Repeat } from '../../../components/FontawesomeIcon'
import LeftAside from '../component/LeftAside'
import BodyWrapper from '../component/BodyWrapper'
import RightContents from '../component/RightContents'

export default function WrapToken() {

  const { account, chainId } = useActiveWeb3React()

  const [wrap, setWrap] = useState<boolean>(true)

  const wrappedNativeCurrency = chainId ? WRAPPED_NATIVE_CURRENCY[chainId] : undefined

  const userNativeTokenBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']

  const userWrappedNativeTokenBalance = useCurrencyBalance(account ?? undefined, wrappedNativeCurrency)

  const [amountInput, setAmountInput] = useState<string>('')
  const nativeTokenInputCurrencyAmount = useNativeCurrencyAmountForTypeInput(amountInput)

  const handleMaxInput = useCallback(() => {
    //console.log('userEthBalance = %s', userEthBalance?.toExact())
    let maxAmountSpendCurrencyAmount
    if (wrap) {
      maxAmountSpendCurrencyAmount = maxAmountSpend(userNativeTokenBalance)
    } else {
      maxAmountSpendCurrencyAmount = userWrappedNativeTokenBalance
    }
    //console.log('maxAmountSpendCurrencyAmount = %s', maxAmountSpendCurrencyAmount?.toExact())
    setAmountInput(maxAmountSpendCurrencyAmount ? maxAmountSpendCurrencyAmount.toExact() : '')
  }, [userNativeTokenBalance, userWrappedNativeTokenBalance, wrap])

  const toggleWrap = useCallback(() => {
    setAmountInput('')
    setWrap(!wrap)
  }, [setWrap, wrap])

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(wrap ? nativeTokenInputCurrencyAmount?.currency : wrappedNativeCurrency, wrap ? wrappedNativeCurrency : nativeTokenInputCurrencyAmount?.currency, amountInput)

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
                    兑换额度
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
                  <div className='mt-2 text-sm text-gray-500 flex justify-between items-center'>
                    <div onClick={handleMaxInput} className='text-blue-600'>
                      您的余额&nbsp;
                      {
                        wrap
                          ? userNativeTokenBalance?.toSignificant(4)
                          : userWrappedNativeTokenBalance?.toSignificant(4)
                      }
                      &nbsp;
                      {
                        wrap
                          ? userNativeTokenBalance?.currency.symbol
                          : userWrappedNativeTokenBalance?.currency.symbol
                      }
                      &nbsp;
                    </div>
                    <div onClick={toggleWrap} className='text-blue-500'>
                      <Repeat />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>

              <button
                disabled={
                  (
                    (wrap && !userNativeTokenBalance?.greaterThan(0))
                    || (!wrap && !userWrappedNativeTokenBalance?.greaterThan(0))
                  )
                  || !!wrapInputError
                }
                type='button'
                className='bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-30'
                onClick={onWrap}
              >
                {
                  wrapInputError ? (
                    <WrapErrorText wrapInputError={wrapInputError} />
                  ) : wrapType === WrapType.WRAP ? (
                    <Trans>Wrap</Trans>
                  ) : wrapType === WrapType.UNWRAP ? (
                      <Trans>Unwrap</Trans>
                    )
                    : <Trans>请输入</Trans>
                }

              </button>

            </div>
          </div>
        </form>

      </RightContents>

    </BodyWrapper>
  )
}
