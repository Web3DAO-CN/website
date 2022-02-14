import { Currency, CurrencyAmount, NativeCurrency } from '@uniswap/sdk-core'
import { SupportedChainId } from 'constants/chains'
import { nativeOnChain } from 'constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import tryParseCurrencyAmount from "../utils/tryParseCurrencyAmount";

export default function useNativeCurrency(): NativeCurrency {
  const { chainId } = useActiveWeb3React()
  return useMemo(
    () =>
      chainId
        ? nativeOnChain(chainId)
        : // display mainnet when not connected
        nativeOnChain(SupportedChainId.MAINNET),
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
