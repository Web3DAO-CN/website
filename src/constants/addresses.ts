import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984', [
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON
  ])
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
}

export const WRAPPER_NATIVE_TOKEN_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [SupportedChainId.POLYGON_MUMBAI]: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  [SupportedChainId.LOCAL]: '0xd5e1B318c5f41Ec23CF82BEa7c41fa176EB129CF'
}

export const MATIC_WRAPPER_ETH_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  [SupportedChainId.POLYGON_MUMBAI]: '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa'
}

export const VALUATION_TOKEN_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON_MUMBAI]: '0x6817c8475Ad33Aa86422160C3d1C673c453A76dE'
}

export const WEB3_DAO_CN_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0xea936a1FD9B9C45840A1E8643E2C0FD7A3FCB41F',
  [SupportedChainId.LOCAL]: ''
}

export const BUY_NFT_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0x694829F9f162e571aC08F4444c12787fb14641b3',
  [SupportedChainId.LOCAL]: ''
}

export const DAO_TREASURY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0x14bD74a10648a27CBB6d7B073199a04dC7Cb759F',
  [SupportedChainId.LOCAL]: ''
}

export const DAO_VAULT_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0xcb2B23A0F9f6c09f81181b7c42c20a1f6FcbBbC4',
  [SupportedChainId.LOCAL]: ''
}

export const DAO_SPONSOR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0xCb2d0A8e9F1c3a1B4Ae90338D5d4516CDA3c0dE2',
  [SupportedChainId.LOCAL]: ''
}
