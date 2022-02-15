import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const MULTICALL_ADDRESS: AddressMap = {
  ...constructSameAddressMap('0x1F98415757620B543A52E61c46B32eB19261F984', [
    SupportedChainId.POLYGON_MUMBAI,
    SupportedChainId.POLYGON,
  ]),
}

export const ARGENT_WALLET_DETECTOR_ADDRESS: AddressMap = {
  [SupportedChainId.MAINNET]: '0xeca4B0bDBf7c55E9b7925919d03CbF8Dc82537E8',
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.MAINNET]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
  [SupportedChainId.RINKEBY]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}

export const WrapperNativeToken: AddressMap = {
  ...constructSameAddressMap('0xc778417e063141139fce010982780140aa0cd5ab', [
    SupportedChainId.RINKEBY,
  ]),
  [SupportedChainId.POLYGON]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  [SupportedChainId.POLYGON_MUMBAI]: '0x6817c8475Ad33Aa86422160C3d1C673c453A76dE',
  [SupportedChainId.LOCAL]: '0xd5e1B318c5f41Ec23CF82BEa7c41fa176EB129CF',
}

export const Web3DAOCN: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0xea936a1FD9B9C45840A1E8643E2C0FD7A3FCB41F',
  [SupportedChainId.LOCAL]: '',
}

export const BuyNFT: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0x694829F9f162e571aC08F4444c12787fb14641b3',
  [SupportedChainId.LOCAL]: '',
}

export const DaoTreasury: AddressMap = {
  [SupportedChainId.POLYGON]: '',
  [SupportedChainId.POLYGON_MUMBAI]: '0x14bD74a10648a27CBB6d7B073199a04dC7Cb759F',
  [SupportedChainId.LOCAL]: '',
}
