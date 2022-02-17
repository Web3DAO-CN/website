import { useEffect, useMemo, useState } from 'react'
import usePrevious from '../usePrevious'
import useActiveWeb3React from '../useActiveWeb3React'
import { Web3Provider } from '@ethersproject/providers'
import { getContract } from '../../utils'
import Web3DAOCN_ABI from 'abis/Web3DAOCN.json'
import { WEB3_DAO_CN_ADDRESSES } from '../../constants/addresses'
import { useWeb3DaoCNContract } from '../useContract'
import { useERC721TotalSupply } from '../useERC721TotalSupply'

interface tokenIdOwnerMapProps {
  tokenId: string,
  owner: string
}

const getTokenIdList = async function(account: string | null | undefined,
                                      library: Web3Provider | undefined,
                                      web3DaoCNAddress: string | undefined,
                                      totalSupply: number | undefined) {
  if (!account || !library || !web3DaoCNAddress || !totalSupply) return undefined

  const retTokenIds: string[] = []
  if (totalSupply && totalSupply > 0) {
    for (let i = 1; i <= totalSupply; i++) {
      retTokenIds.push(i.toString())
    }
  }
  return retTokenIds
}

export function useGetTokenIdList(totalSupply: number | undefined) {
  const { account, chainId, library } = useActiveWeb3React()
  const lastAccount = usePrevious(account)
  const lastLibrary = usePrevious(library)

  const [tokenIdList, setTokenIdList] = useState<string[]>([])
  const lastTokenIdList = usePrevious(tokenIdList)

  const contractAddress = chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined
  const lastContractAddress = usePrevious(contractAddress)

  const lastTotalSupply = usePrevious(totalSupply)

  useEffect(() => {
      if (account === lastAccount
        && library === lastLibrary
        && lastTotalSupply === totalSupply
        && lastContractAddress === contractAddress
        && JSON.stringify(lastTokenIdList) === JSON.stringify(tokenIdList)
      ) {
        return
      } else if (account && library && contractAddress && contractAddress) {
        getTokenIdList(account, library, contractAddress, totalSupply)
          .then((retTokenIdList) => {
            // console.log('%s retTokenIdList = %s', new Date().getTime(), JSON.stringify(retTokenIdList))
            if (retTokenIdList) {
              setTokenIdList(retTokenIdList)
            }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }, [
      lastTokenIdList, tokenIdList,
      lastAccount, account,
      lastLibrary, library,
      lastContractAddress, contractAddress,
      lastTotalSupply, totalSupply
    ]
  )
  return { tokenIdList, setTokenIdList }
}

const getOwnerList = async function(library: Web3Provider | undefined,
                                    contractAddress: string | undefined,
                                    tokenIdList: string[]): Promise<string[]> {
  if (!library || !contractAddress) return []
  const _ownerList: any[] = []
  await Promise.all(tokenIdList.map(async (tokenId) => {
    const contract = getContract(contractAddress, Web3DAOCN_ABI, library)
    const owner = await contract.ownerOf(tokenId)
    _ownerList.push(owner)
  }))
  return _ownerList
}

export function useGetOwnerList() {
  const { chainId, library } = useActiveWeb3React()
  const lastLibrary = usePrevious(library)

  const contract = useWeb3DaoCNContract()
  const totalSupply = useERC721TotalSupply(contract?.address)

  const { tokenIdList } = useGetTokenIdList(totalSupply)
  const lastTokenIdList = usePrevious(tokenIdList)

  const [ownerList, setOwnerList] = useState<string[]>([])
  const lastOwnerList = usePrevious(ownerList)

  const web3DaoCNAddress = chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined

  useEffect(() => {
    if (library === lastLibrary
      && JSON.stringify(tokenIdList) === JSON.stringify(lastTokenIdList)
      && JSON.stringify(lastOwnerList) === JSON.stringify(ownerList)
    ) {
      return
    }
    if (library && web3DaoCNAddress && tokenIdList) {
      getOwnerList(library, web3DaoCNAddress, tokenIdList)
        .then((ownerList) => {
          if (ownerList) {
            setOwnerList(ownerList)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [lastOwnerList, ownerList, lastTokenIdList, tokenIdList, lastLibrary, library, web3DaoCNAddress])
  return { ownerList, setOwnerList }
}

export function useTokenIdOwnerMapList() {

  const contract = useWeb3DaoCNContract()
  const totalSupply = useERC721TotalSupply(contract?.address)

  // console.log('%s totalSupply = %s', new Date().getTime(), totalSupply)

  const { tokenIdList } = useGetTokenIdList(totalSupply)
  const lastTokenIdList = usePrevious(tokenIdList)

  const { ownerList } = useGetOwnerList()
  const lastOwnerList = usePrevious(ownerList)

  const [tokenIdOwnerMapList, setTokenIdOwnerMapList] = useState<tokenIdOwnerMapProps[] | null>(null)
  //console.log('%s tokenIdOwnerMapList = %s', new Date().getTime(), JSON.stringify(tokenIdOwnerMapList))
  const lastTokenIdOwnerMapList = usePrevious(tokenIdOwnerMapList)

  useEffect(() => {
      if (JSON.stringify(tokenIdList) === JSON.stringify(lastTokenIdList)
        && JSON.stringify(ownerList) === JSON.stringify(lastOwnerList)
        && JSON.stringify(tokenIdOwnerMapList) === JSON.stringify(lastTokenIdOwnerMapList)) {
        return
      }
      if (tokenIdList && tokenIdList.length > 0 && ownerList && ownerList.length > 0) {
        const retTokenIdOwnerMapList: tokenIdOwnerMapProps[] = []
        tokenIdList.map((tokenId, index) => {
          retTokenIdOwnerMapList.push({ tokenId, owner: ownerList[index] })
        })
        //
        setTokenIdOwnerMapList(retTokenIdOwnerMapList)
      }
    }, [lastTokenIdList, tokenIdList,
      lastOwnerList, ownerList,
      lastTokenIdOwnerMapList, tokenIdOwnerMapList
    ]
  )
  return { tokenIdOwnerMapList, setTokenIdOwnerMapList }
}

export function useTokenIdsByOwner(owner?: string | null): string[] {
  const { tokenIdOwnerMapList } = useTokenIdOwnerMapList()

  return useMemo(() => {
    if (owner && tokenIdOwnerMapList && tokenIdOwnerMapList.length > 0) {
      const retTokenIds: string[] = []
      tokenIdOwnerMapList.map((tokenIdOwnerMap) => {
        if (tokenIdOwnerMap.owner === owner) {
          retTokenIds.push(tokenIdOwnerMap.tokenId)
        }
      })
      return retTokenIds
    }
    return []
  }, [owner, tokenIdOwnerMapList])
}
