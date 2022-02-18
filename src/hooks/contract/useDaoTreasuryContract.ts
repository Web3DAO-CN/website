import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoTreasury } from '../useContract'
import { BigNumber } from '@ethersproject/bignumber'

export function useGasAttrPrice(): BigNumber | undefined {
  const contract = useDaoTreasury()
  const result = useSingleCallResult(contract, 'gasAttrPrice')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}

export function useHoldNFTId(): BigNumber | undefined {
  const contract = useDaoTreasury()
  const result = useSingleCallResult(contract, 'holdNFTId')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}

