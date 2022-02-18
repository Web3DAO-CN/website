import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useSingleCallResult } from 'lib/hooks/multicall'

import { useTokenContract, useTokenContractERC3664 } from './useContract'

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Currency): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.isToken ? token.address : undefined, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0]

  return token?.isToken && totalSupply ? CurrencyAmount.fromRawAmount(token, totalSupply.toString()) : undefined
}

export function useTotalSupplyERC3664(token?: Currency, attrId?: string | number): CurrencyAmount<Token> | undefined {
  const contract = useTokenContractERC3664(token?.isToken ? token.address : undefined, false)

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply', [attrId])?.result?.[0]

  return token?.isToken && totalSupply ? CurrencyAmount.fromRawAmount(token, totalSupply.toString()) : undefined
}

/*export function useTotalSupplyByAttrId(attrId?: number, contractAddress?: string): BigNumber | undefined {
  const contract = useERC3664Contract(contractAddress)
  return useSingleCallResult(contract, 'totalSupply', [attrId])?.result?.[0]
}*/
