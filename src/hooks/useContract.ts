import { Contract } from '@ethersproject/contracts'
import ARGENT_WALLET_DETECTOR_ABI from 'abis/argent-wallet-detector.json'
import Web3DAOCN_ABI from 'abis/Web3DAOCN.json'
import BUY_NFT_ABI from 'abis/BuyNft.json'
import DaoTreasury_ABI from 'abis/DaoTreasury.json'
import DaoVault_ABI from 'abis/DaoVault.json'
import DaoSponsor_ABI from 'abis/DaoSponsor.json'
import EIP_2612 from 'abis/eip_2612.json'
import ENS_PUBLIC_RESOLVER_ABI from 'abis/ens-public-resolver.json'
import ENS_ABI from 'abis/ens-registrar.json'
import ERC20_ABI from 'abis/erc20.json'
import ERC3664_ABI from 'abis/erc3664.json'
import ERC20_BYTES32_ABI from 'abis/erc20_bytes32.json'
import ERC721_ABI from 'abis/erc721.json'
import ERC1155_ABI from 'abis/erc1155.json'
import UniswapInterfaceMulticallJson from 'abis/UniswapInterfaceMulticall.json'
import { ArgentWalletDetector, EnsPublicResolver, EnsRegistrar, Erc1155, Erc20, Erc721, UniswapInterfaceMulticall, Weth } from 'abis/types'
import WETH_ABI from 'abis/weth.json'
import { ARGENT_WALLET_DETECTOR_ADDRESS, BUY_NFT_ADDRESSES, DAO_SPONSOR_ADDRESSES, DAO_TREASURY_ADDRESSES, DAO_VAULT_ADDRESSES, ENS_REGISTRAR_ADDRESSES, MULTICALL_ADDRESS, VALUATION_TOKEN_ADDRESSES, WEB3_DAO_CN_ADDRESSES } from 'constants/addresses'
import { WRAPPED_NATIVE_TOKEN } from 'constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'

import { getContract } from '../utils'
import { Erc3664 } from '../abis/types/Erc3664'

const { abi: MulticallABI } = UniswapInterfaceMulticallJson

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { library, account, chainId } = useActiveWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useTokenContractERC3664(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc3664>(tokenAddress, ERC3664_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean) {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(
    chainId ? WRAPPED_NATIVE_TOKEN[chainId]?.address : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}

export function useERC721Contract(nftAddress?: string) {
  return useContract<Erc721>(nftAddress, ERC721_ABI, false)
}

export function useERC1155Contract(nftAddress?: string) {
  return useContract<Erc1155>(nftAddress, ERC1155_ABI, false)
}

export function useArgentWalletDetectorContract() {
  return useContract<ArgentWalletDetector>(ARGENT_WALLET_DETECTOR_ADDRESS, ARGENT_WALLET_DETECTOR_ABI, false)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean) {
  return useContract<EnsRegistrar>(ENS_REGISTRAR_ADDRESSES, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean) {
  return useContract<EnsPublicResolver>(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function useEIP2612Contract(tokenAddress?: string): Contract | null {
  return useContract(tokenAddress, EIP_2612, false)
}

export function useERC3664Contract(contractAddress?: string): Contract | null {
  return useContract<Erc3664>(contractAddress, ERC3664_ABI, false)
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(MULTICALL_ADDRESS, MulticallABI, false) as UniswapInterfaceMulticall
}

export function useWeb3DaoCNContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined
  return useContract(address, Web3DAOCN_ABI, true)
}

export function useBuyNFTContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = chainId ? BUY_NFT_ADDRESSES[chainId] : undefined
  return useContract(address, BUY_NFT_ABI, true)
}

export function useDaoTreasury(): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = chainId ? DAO_TREASURY_ADDRESSES[chainId] : undefined
  return useContract(address, DaoTreasury_ABI, true)
}

export function useDaoVault(): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = chainId ? DAO_VAULT_ADDRESSES[chainId] : undefined
  return useContract(address, DaoVault_ABI, true)
}

export function useDaoSponsor(): Contract | null {
  const { chainId } = useActiveWeb3React()
  const address = chainId ? DAO_SPONSOR_ADDRESSES[chainId] : undefined
  return useContract(address, DaoSponsor_ABI, true)
}

export function useValuationTokenContract(withSignerIfPossible?: boolean) {
  const { chainId } = useActiveWeb3React()
  return useContract<Weth>(
    chainId ? VALUATION_TOKEN_ADDRESSES[chainId] : undefined,
    WETH_ABI,
    withSignerIfPossible
  )
}
