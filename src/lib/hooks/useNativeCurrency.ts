import { Currency, CurrencyAmount, NativeCurrency } from '@uniswap/sdk-core'
import { DEFAULT_CHAIN_ID } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import tryParseCurrencyAmount from '../utils/tryParseCurrencyAmount'

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useActiveWeb3React()
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display default when not connected
        nativeOnChain(DEFAULT_CHAIN_ID),
    [chainId]
  )
}

//用户键入
export function useNativeCurrencyAmountForTypeInput(value?: number | string): CurrencyAmount<Currency> | undefined {
  const nativeToken = useNativeCurrency()
  return useMemo(() => {
    if (nativeToken && value) {
      return tryParseCurrencyAmount(value + '', nativeToken)
    } else {
      return undefined
    }
  }, [value, nativeToken])
}

export function useNativeCurrencyAmount(value?: number | string): CurrencyAmount<Currency> | undefined {
  const nativeToken = useNativeCurrency()
  return useMemo(() => {
    if (nativeToken && value) {
      return CurrencyAmount.fromRawAmount(nativeToken, value)
    } else {
      return undefined
    }
  }, [value, nativeToken])
}

export function useERC20CurrencyAmountForTypeInput(amount: string | undefined, currency: Currency | undefined | null): CurrencyAmount<Currency> | undefined {
  return useMemo(() => {
    if (amount && currency) {
      return tryParseCurrencyAmount(amount, currency)
    } else {
      return undefined
    }
  }, [amount, currency])
}

export function useERC20CurrencyAmount(amount: string | undefined, currency: Currency | undefined | null): CurrencyAmount<Currency> | undefined {
  return useMemo(() => {
    if (amount && currency) {
      return CurrencyAmount.fromRawAmount(currency, amount)
    } else {
      return undefined
    }
  }, [amount, currency])
}
