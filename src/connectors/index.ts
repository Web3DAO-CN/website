import { Web3Provider } from '@ethersproject/providers'
import { ALL_SUPPORTED_CHAIN_IDS } from 'constants/chains'
import { InjectedConnector } from 'web3-react-injected-connector'
import { WalletConnectConnector } from 'web3-react-walletconnect-connector'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'
import { RPC_URLS } from "../constants/chainInfo";

export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: 1,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: RPC_URLS,
  qrcode: true,
})

// mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: FORMATIC_KEY ?? '',
//   chainId: 1,
// })

// mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1],
// })

// export const walletlink = new WalletLinkConnector({
//   url: INFURA_NETWORK_URLS[SupportedChainId.MAINNET],
//   appName: 'Uniswap',
//   appLogoUrl: UNISWAP_LOGO_URL,
//   supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
// })
