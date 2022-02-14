import ethereumLogoUrl from 'assets/images/ethereum-logo.png'
import polygonMaticLogo from 'assets/svg/polygon-matic-logo.svg'
import ms from 'ms.macro'

import { SupportedChainId, SupportedL1ChainId, SupportedL2ChainId } from './chains'


const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const RPC_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.POLYGON]: 'https://polygon-rpc.com',
  [SupportedChainId.POLYGON_MUMBAI]: 'https://rpc-mumbai.matic.today',
  [SupportedChainId.LOCAL]: 'http://127.0.0.1:8545',
}

/**
 * This is used to call the add network RPC
 */
interface AddNetworkInfo {
  readonly rpcUrl: string
  readonly nativeToken: {
    name: string // e.g. 'Goerli ETH',
    symbol: string // e.g. 'gorETH',
    decimals: number // e.g. 18,
  }
}

export enum NetworkType {
  L1,
  L2,
}

interface BaseChainInfo {
  readonly mainNetwork: boolean
  readonly networkType: NetworkType
  readonly blockWaitMsBeforeWarning?: number
  readonly docs: string
  readonly bridge?: string
  readonly faucet?: string
  readonly explorer: string
  readonly infoLink: string
  readonly logoUrl: string
  readonly label: string
  readonly helpCenterUrl?: string
  readonly addNetworkInfo: AddNetworkInfo
  readonly nativeTokenLogo: string
}

export interface L1ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L1
}

export interface L2ChainInfo extends BaseChainInfo {
  readonly networkType: NetworkType.L2
  readonly bridge: string
  readonly statusPage?: string
  readonly defaultListUrl: string
}

export type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo }
  & { readonly [chainId in SupportedL2ChainId]: L2ChainInfo }
  & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

export const CHAIN_INFO: ChainInfoMap = {

  [SupportedChainId.RINKEBY]: {
    mainNetwork: false,
    networkType: NetworkType.L1,
    docs: '',
    explorer: 'https://rinkeby.etherscan.io',
    infoLink: '',
    label: 'Rinkeby',
    logoUrl: ethereumLogoUrl,
    nativeTokenLogo: ethereumLogoUrl,
    addNetworkInfo: {
      nativeToken: { name: 'Rinkeby Ether', symbol: 'rETH', decimals: 18 },
      rpcUrl: RPC_URLS[SupportedChainId.RINKEBY],
    },
    faucet: 'https://faucets.chain.link/rinkeby',
  },

  [SupportedChainId.POLYGON]: {
    mainNetwork: true,
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://polygonscan.com',
    infoLink: '',
    label: 'Polygon',
    logoUrl: polygonMaticLogo,
    nativeTokenLogo: polygonMaticLogo,
    addNetworkInfo: {
      nativeToken: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrl: RPC_URLS[SupportedChainId.POLYGON],
    },
  },

  [SupportedChainId.POLYGON_MUMBAI]: {
    mainNetwork: false,
    networkType: NetworkType.L1,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://mumbai.polygonscan.com',
    infoLink: '',
    label: 'Polygon Mumbai',
    logoUrl: polygonMaticLogo,
    nativeTokenLogo: polygonMaticLogo,
    addNetworkInfo: {
      nativeToken: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrl: RPC_URLS[SupportedChainId.POLYGON_MUMBAI],
    },
    faucet: 'https://faucet.polygon.technology',
  },

  [SupportedChainId.LOCAL]: {
    mainNetwork: false,
    networkType: NetworkType.L2,
    blockWaitMsBeforeWarning: ms`10m`,
    bridge: '',
    defaultListUrl: '',
    docs: '',
    explorer: '',
    infoLink: '',
    label: 'Local',
    logoUrl: polygonMaticLogo,
    nativeTokenLogo: polygonMaticLogo,
    addNetworkInfo: {
      nativeToken: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrl: RPC_URLS[SupportedChainId.LOCAL],
    },
  },

}
