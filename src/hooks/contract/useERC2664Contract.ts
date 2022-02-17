import { useERC3664Contract } from '../useContract'
import { useSingleCallResult } from '../../lib/hooks/multicall'
import { BigNumber } from '@ethersproject/bignumber'

export function useTotalSupplyByAttrId(attrId?: number, contractAddress?: string): BigNumber | undefined {
  const contract = useERC3664Contract(contractAddress)
  return useSingleCallResult(contract, 'totalSupply', [attrId])?.result?.[0]
}
