import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useBuyNFTContract } from '../useContract'

export function usePrice(): string {
  const contract = useBuyNFTContract()
  const result = useSingleCallResult(contract, 'price')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}
