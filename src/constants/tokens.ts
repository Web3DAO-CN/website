import { Currency, Ether, NativeCurrency, Token, WETH9 } from '@uniswap/sdk-core'

import { WrapperNativeToken } from './addresses'
import { SupportedChainId } from './chains'

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token } = {
  ...WETH9,
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    WrapperNativeToken[SupportedChainId.RINKEBY],
    18,
    'WETH',
    'Wrapped Ether'
  ),

  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    WrapperNativeToken[SupportedChainId.POLYGON],
    18,
    'WMATIC',
    'Wrapped Matic'
  ),

  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WrapperNativeToken[SupportedChainId.POLYGON_MUMBAI],
    18,
    'WMATIC',
    'Wrapped Matic'
  ),

  [SupportedChainId.LOCAL]: new Token(
    SupportedChainId.LOCAL,
    WrapperNativeToken[SupportedChainId.LOCAL],
    18,
    'WMATIC',
    'Wrapped Matic'
  )
}

function isMatic(chainId: number): chainId is SupportedChainId.POLYGON | SupportedChainId.POLYGON_MUMBAI {
  return chainId === SupportedChainId.POLYGON_MUMBAI || chainId === SupportedChainId.POLYGON
}

class MaticNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    if (!isMatic(this.chainId)) throw new Error('Not matic')
    return WRAPPED_NATIVE_CURRENCY[this.chainId]
  }

  public constructor(chainId: number) {
    if (!isMatic(chainId)) throw new Error('Not matic')
    super(chainId, 18, 'MATIC', 'Polygon Matic')
  }
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WRAPPED_NATIVE_CURRENCY) return WRAPPED_NATIVE_CURRENCY[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency } = {}

export function nativeOnChain(chainId: number): NativeCurrency {
  return (
    cachedNativeCurrency[chainId] ??
    (cachedNativeCurrency[chainId] = isMatic(chainId)
      ? new MaticNativeCurrency(chainId)
      : ExtendedEther.onChain(chainId))
  )
}
