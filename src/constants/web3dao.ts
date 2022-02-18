import { Token } from '@uniswap/sdk-core'
import { SupportedChainId } from './chains'
import { MATIC_WRAPPER_ETH_ADDRESSES, VALUATION_TOKEN_ADDRESSES, WEB3_DAO_CN_ADDRESSES } from './addresses'

export enum AttrIdEnum {
  gas = 1,
  block = 2,
  nonce = 3,
  tx = 4,
  sp = 5,
}

export interface AttrIdProp {
  readonly name: string
  readonly symbol: string
  readonly decimal: number
}

export const WEB3_DAO_CN_ATTR: { [key in AttrIdEnum]: AttrIdProp } = {
  [AttrIdEnum.gas]: { name: 'Gas', symbol: 'gas', decimal: 18 },
  [AttrIdEnum.block]: { name: 'Block', symbol: 'block', decimal: 18 },
  [AttrIdEnum.nonce]: { name: 'Nonce', symbol: 'nonce', decimal: 18 },
  [AttrIdEnum.tx]: { name: 'Tx', symbol: 'tx', decimal: 18 },
  [AttrIdEnum.sp]: { name: 'Sponsor', symbol: 'sp', decimal: 18 }
}

export const GAS_TOKEN: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WEB3_DAO_CN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    WEB3_DAO_CN_ATTR[AttrIdEnum.gas].decimal,
    WEB3_DAO_CN_ATTR[AttrIdEnum.gas].symbol,
    WEB3_DAO_CN_ATTR[AttrIdEnum.gas].name
  )
}

export const BLOCK_TOKEN: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WEB3_DAO_CN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    WEB3_DAO_CN_ATTR[AttrIdEnum.block].decimal,
    WEB3_DAO_CN_ATTR[AttrIdEnum.block].symbol,
    WEB3_DAO_CN_ATTR[AttrIdEnum.block].name
  )
}

export const NONCE_TOKEN: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WEB3_DAO_CN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    WEB3_DAO_CN_ATTR[AttrIdEnum.nonce].decimal,
    WEB3_DAO_CN_ATTR[AttrIdEnum.nonce].symbol,
    WEB3_DAO_CN_ATTR[AttrIdEnum.nonce].name
  )
}

export const TX_TOKEN: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WEB3_DAO_CN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    WEB3_DAO_CN_ATTR[AttrIdEnum.tx].decimal,
    WEB3_DAO_CN_ATTR[AttrIdEnum.tx].symbol,
    WEB3_DAO_CN_ATTR[AttrIdEnum.tx].name
  )
}

export const SPONSOR_TOKEN: { [chainId: number]: Token } = {
  [SupportedChainId.POLYGON_MUMBAI]: new Token(
    SupportedChainId.POLYGON_MUMBAI,
    WEB3_DAO_CN_ADDRESSES[SupportedChainId.POLYGON_MUMBAI],
    WEB3_DAO_CN_ATTR[AttrIdEnum.sp].decimal,
    WEB3_DAO_CN_ATTR[AttrIdEnum.sp].symbol,
    WEB3_DAO_CN_ATTR[AttrIdEnum.sp].name
  )
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
