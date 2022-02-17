import { BigNumber } from '@ethersproject/bignumber'
import { useSingleCallResult } from 'lib/hooks/multicall'

import { useERC721Contract } from './useContract'

export function useERC721TotalSupply(address?: string): number | undefined {
  const contract = useERC721Contract(address)
  const totalSupply: BigNumber | undefined = useSingleCallResult(contract, 'totalSupply')?.result?.[0]
  // if (totalSupply?.gt(0)) {
  // debugger
  // }
  return totalSupply?.toNumber()
}
