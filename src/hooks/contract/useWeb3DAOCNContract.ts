import { useMemo } from 'react'

import { useSingleContractMultipleData } from 'lib/hooks/multicall'
import { useWeb3DaoCNContract } from '../useContract'
import { useERC721TotalSupply } from '../useERC721TotalSupply'

export function useTokenIdOwnerArr(): { tokenId: string, owner: string }[] {
  const contract = useWeb3DaoCNContract()
  const totalSupply = useERC721TotalSupply(contract?.address)

  const tokenIds: string[] = useMemo(() => {
    const retArr: string[] = []
    if (totalSupply && totalSupply > 0) {
      for (let i = 1; i <= totalSupply; i++) {
        retArr.push(i.toString())
      }
    }
    return retArr
  }, [totalSupply])

  const results = useSingleContractMultipleData(
    contract,
    'ownerOf',
    tokenIds.map((tokenId) => [tokenId])
  )
  // console.log('useTokenIdOwnerArr = %s', new Date().getTime())

  return useMemo(() => {
    const tokenIdOwnerArr: { tokenId: string, owner: string }[] = []
    tokenIds.map((tokenId, index) => {
      const owner = results?.[index]?.result?.[0]
      tokenIdOwnerArr.push({ tokenId, owner })
    })
    return tokenIdOwnerArr
  }, [tokenIds, results])

}

export function useTokenIdsByOwner(owner?: string | null): string[] {
  const tokenIdOwnerArr = useTokenIdOwnerArr()

  return useMemo(() => {
    const tokenIds: string[] = []
    if (tokenIdOwnerArr && owner) {
      console.log('useTokenIdsByOwner = %s', new Date().getTime())
      tokenIdOwnerArr.map((tokenIdOwner) => {
        if (tokenIdOwner.owner === owner) {
          tokenIds.push(tokenIdOwner.tokenId)
        }
      })
    }
    return tokenIds
  }, [owner, tokenIdOwnerArr])
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
