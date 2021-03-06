import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoVault } from '../useContract'
import { BigNumber } from '@ethersproject/bignumber'

export function useReserve(): BigNumber | undefined {
  const contract = useDaoVault()
  const result = useSingleCallResult(contract, 'reserve')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}
