import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoVault } from '../useContract'

export function useReserve(): string {
  const contract = useDaoVault()
  const result = useSingleCallResult(contract, 'reserve')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}
