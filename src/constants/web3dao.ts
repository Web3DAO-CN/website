import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'
import { MATIC_WRAPPER_ETH_ADDRESSES, VALUATION_TOKEN_ADDRESSES } from './addresses'

//计价token
export const VALUATION_TOKEN: { [chainId: number]: Token } = {

  //马蹄主网 对标 以太主网 使用 马蹄主网WETH
  [SupportedChainId.POLYGON]: new Token(
    SupportedChainId.POLYGON,
    MATIC_WRAPPER_ETH_ADDRESSES[SupportedChainId.POLYGON],
    18,
    'WETH',
    'Wrapped Ether'
  ),

  //马蹄测试网采用 MATIC 兑换为 WETH，满足测试
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    VALUATION_TOKEN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    18,
    'WETH',
    'Wrapped Ether'
  )

}
