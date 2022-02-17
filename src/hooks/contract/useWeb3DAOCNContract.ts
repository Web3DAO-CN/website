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
            console.log('%s retTokenIdList = %s', new Date().getTime(), JSON.stringify(retTokenIdList))
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


/*export async function getTotalSupply(account: string | null | undefined, library: Web3Provider | undefined, web3DaoCNAddress: string | undefined) {
  if (!account || !library || !web3DaoCNAddress) return undefined
  const contract = getContract(web3DaoCNAddress, Web3DAOCN_ABI, library)
  return await contract.totalSupply()
}

const getTokenIdList = async function(account: string | null | undefined, library: Web3Provider | undefined, web3DaoCNAddress: string | undefined) {
  if (!account || !library || !web3DaoCNAddress) return undefined

  debugger
  //const contract = getContract(web3DaoCNAddress, Web3DAOCN_ABI, library)
  // const totalSupply = await contract.totalSupply()

  const totalSupply = await getTotalSupply(account, library, web3DaoCNAddress)

  const retTokenIds: string[] = []
  if (totalSupply && totalSupply > 0) {
    for (let i = 1; i <= totalSupply; i++) {
      retTokenIds.push(i.toString())
    }
  }
  return retTokenIds
}

export function useGetTokenIdList() {
  const { account, chainId, library } = useActiveWeb3React()
  const lastAccount = usePrevious(account)
  const lastLibrary = usePrevious(library)

  const [tokenIdList, setTokenIdList] = useState<string[] | null>(null)
  const lastTokenIdList = usePrevious(tokenIdList)

  const web3DaoCNAddress = chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined

  useEffect(() => {
    if (account === lastAccount
      && library === lastLibrary
      && JSON.stringify(lastTokenIdList) === JSON.stringify(tokenIdList)
    ) {
      return
    }
    if (account && library) {
      getTokenIdList(account, library, web3DaoCNAddress)
        .then((tokenIdList) => {
          if (tokenIdList) {
            setTokenIdList(tokenIdList)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [lastTokenIdList, tokenIdList, lastAccount, account, lastLibrary, library, web3DaoCNAddress])
  return { tokenIdList, setTokenIdList }
}

const getOwnerList = async function(account: string | null | undefined,
                                    library: Web3Provider | undefined,
                                    web3DaoCNAddress: string | undefined,
                                    tokenIdList: string[]): Promise<string[]> {
  if (!account || !library || !web3DaoCNAddress) return []
  const _ownerList: string[] = []
  await Promise.all(tokenIdList.map(async (tokenId) => {
    const contract = getContract(tokenId, Web3DAOCN_ABI, library)
    const owner = await contract.ownerOf(account)
    _ownerList.push(owner)
  }))
  return _ownerList
}

export function useGetOwnerList() {
  const { account, chainId, library } = useActiveWeb3React()
  const lastAccount = usePrevious(account)
  const lastLibrary = usePrevious(library)

  const { tokenIdList } = useGetTokenIdList()
  const lastTokenIdList = usePrevious(tokenIdList)

  const [ownerList, setOwnerList] = useState<string[] | null>(null)
  const lastOwnerList = usePrevious(ownerList)

  const web3DaoCNAddress = chainId ? WEB3_DAO_CN_ADDRESSES[chainId] : undefined

  useEffect(() => {
    if (account === lastAccount
      && library === lastLibrary
      && JSON.stringify(tokenIdList) === JSON.stringify(lastTokenIdList)
      && JSON.stringify(lastOwnerList) === JSON.stringify(ownerList)
    ) {
      return
    }
    if (account && library && web3DaoCNAddress && tokenIdList) {
      getOwnerList(account, library, web3DaoCNAddress, tokenIdList)
        .then((ownerList) => {
          if (ownerList) {
            setOwnerList(ownerList)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [lastOwnerList, ownerList, lastTokenIdList, tokenIdList, lastAccount, account, lastLibrary, library, web3DaoCNAddress])
  return { ownerList, setOwnerList }
}*/

/*export function useOwnerList() {

  const { library } = useActiveWeb3React()
  const lastLibrary = usePrevious(library)

  const contract = useWeb3DaoCNContract()

  const { tokenIds } = useTokenIds()

  const ownerResultList = useSingleContractMultipleData(
    contract,
    'ownerOf',
    tokenIds.map((tokenId) => [tokenId])
  )
  console.log('%s ownerResultList = %s', new Date().getTime(), JSON.stringify(ownerResultList))
  const lastOwnerResultList = usePrevious(ownerResultList)

  const [ownerList, setOwnerList] = useState<string[] | null>(null)
  const ownerListDebounce = useDebounce(ownerList, 200)

  useEffect(() => {
    if (library
      && library === lastLibrary
      // && ownerResultList
      // && ownerResultList.length > 0
      && JSON.stringify(ownerResultList) === JSON.stringify(lastOwnerResultList)) {
      return
    }
    if (library && ownerResultList && ownerResultList.length > 0) {
      const retOwnerList_: string[] = []
      ownerResultList.map((ownerResult) => {
        const owner = ownerResult?.result?.[0]
        retOwnerList_.push(owner)
      })
      setOwnerList(retOwnerList_)
    }
  }, [ownerResultList, lastOwnerResultList, lastLibrary, library])
  return { ownerList: ownerListDebounce, setOwnerList }
}*/

export function useTokenIdOwnerMapList() {

  const contract = useWeb3DaoCNContract()
  const totalSupply = useERC721TotalSupply(contract?.address)

  console.log('%s totalSupply = %s', new Date().getTime(), totalSupply)

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

// export function useTotalSupply(attrId: number): string[] {
//   const tokenIdOwnerArr = useTokenIdOwnerArr()
//   return useMemo(() => {
//     const tokenIds: string[] = []
//     if (tokenIdOwnerArr && owner) {
//       console.log('useTokenIdsByOwner = %s', new Date().getTime())
//       tokenIdOwnerArr.map((tokenIdOwner) => {
//         if (tokenIdOwner.owner === owner) {
//           tokenIds.push(tokenIdOwner.tokenId)
//         }
//       })
//     }
//     return tokenIds
//   }, [owner, tokenIdOwnerArr])
// }
