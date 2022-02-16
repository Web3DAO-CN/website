import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'
import { MATIC_WRAPPER_ETH_ADDRESSES, VALUATION_TOKEN_ADDRESSES } from './addresses'

export const Web3DAOCN_AttrId = {
  gas: { attrId: 1, name: 'Gas', symbol: 'gas', decimal: 18 },
  block: { attrId: 2, name: 'Block', symbol: 'block', decimal: 18 },
  nonce: { attrId: 3, name: 'Nonce', symbol: 'nonce', decimal: 18 },
  tx: { attrId: 4, name: 'Tx', symbol: 'tx', decimal: 18 },
  sp: { attrId: 5, name: 'Sponsor', symbol: 'sp', decimal: 18 }
}

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
