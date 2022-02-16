import { Currency } from '@uniswap/sdk-core'

import { nativeOnChain, WRAPPED_NATIVE_TOKEN } from '../constants/tokens'
import { supportedChainId } from './supportedChainId'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency
  const formattedChainId = supportedChainId(currency.chainId)
  if (formattedChainId && currency.equals(WRAPPED_NATIVE_TOKEN[formattedChainId]))
    return nativeOnChain(currency.chainId)
  return currency
}
