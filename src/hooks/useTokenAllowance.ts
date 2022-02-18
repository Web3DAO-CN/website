import { CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useMemo } from 'react'

import { useTokenContract, useTokenContractERC3664 } from './useContract'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => (owner && spender) ? [owner, spender] : [undefined, undefined], [owner, spender])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}

export function useTokenAllowanceERC3664(token?: Token, fromTokenId?: string, toTokenId?: string, attrId?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContractERC3664(token?.address, false)

  const inputs = useMemo(() => (fromTokenId && toTokenId && attrId) ? [fromTokenId, toTokenId, attrId] : [undefined, undefined, undefined], [fromTokenId, toTokenId, attrId])
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}
