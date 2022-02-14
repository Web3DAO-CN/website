import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useBuyNFTContract } from './useContract'

export function useBuyNFTPrice(): string {
  const contract = useBuyNFTContract()
  const price = useSingleCallResult(contract, 'price')?.result?.[0]
  return useMemo(() => {
    return price ? price : undefined
  }, [price])
}
