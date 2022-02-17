import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoSponsor } from '../useContract'
import { LockVaultT } from '../../types/web3dao'

export function useLockVault(tokenId?: string): LockVaultT | undefined {
  const contract = useDaoSponsor()
  const result = useSingleCallResult(contract, 'lockVault', [tokenId])?.result?.[0]
  return useMemo(() => {
    return result ? {
      sponsorAmount: result.sponsorAmount,
      stakeAmount: result.stakeAmount,
      borrowGasAmount: result.borrowGasAmount,
      time: result.time
    } : undefined
  }, [result])
}
