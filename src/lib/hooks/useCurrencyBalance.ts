import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import ERC20ABI from 'abis/erc20.json'
import { Erc20Interface } from 'abis/types/Erc20'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import JSBI from 'jsbi'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from 'lib/hooks/multicall'
import { useMemo } from 'react'

import { nativeOnChain } from '../../constants/tokens'
import { useInterfaceMulticall, useTokenContractERC3664 } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useNativeCurrencyBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined
} {
  const { chainId } = useActiveWeb3React()
  const multicallContract = useInterfaceMulticall()

  const validAddressInputs: [string][] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
          .map(isAddress)
          .filter((a): a is string => a !== false)
          .sort()
          .map((addr) => [addr])
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(multicallContract, 'getEthBalance', validAddressInputs)

  return useMemo(
    () =>
      validAddressInputs.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, [address], i) => {
        const value = results?.[i]?.result?.[0]
        if (value && chainId)
          memo[address] = CurrencyAmount.fromRawAmount(nativeOnChain(chainId), JSBI.BigInt(value.toString()))
        return memo
      }, {}),
    [validAddressInputs, chainId, results]
  )
}

const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
const tokenBalancesGasRequirement = { gasRequired: 125_000 }

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    useMemo(() => [address], [address]),
    tokenBalancesGasRequirement
  )

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
          const value = balances?.[i]?.result?.[0]
          const amount = value ? JSBI.BigInt(value.toString()) : undefined
          if (amount) {
            memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
          }
          return memo
        }, {})
        : {},
      anyLoading
    ],
    [address, validatedTokens, anyLoading, balances]
  )
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token])
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
  const ethBalance = useNativeCurrencyBalances(useMemo(() => (containsETH ? [account] : []), [containsETH, account]))

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export default function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0]
}

/*

interface TokenERC3664Props {
  token: Token
  attrId: string | number
}

export function useTokenBalancesWithLoadingIndicatorERC3664(
  tokenContractAddress?: string,
  tokenId?: string,
  tokens?: (Token | undefined)[],
  attrIds?: (string | number | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {

  if (tokens && attrIds && tokens?.length != attrIds?.length) {
    throw new Error('invalid tokens attrIds,length ')
  }

  const validatedTokens = useMemo(() => {
    const arr: TokenERC3664Props[] = []
    tokens?.map((token, index) => {
      if (token && attrIds && attrIds[index] && isAddress(token?.address)) {
        arr.push(
          { token, attrId: attrIds[index] ?? '' }
        )
      }
    })
    return arr
  }, [tokens, attrIds])

  const tokenContract = useTokenContractERC3664(tokenContractAddress, false)

  const balanceOfBatch = useSingleCallResult(tokenContract, 'balanceOfBatch', [tokenId, [attrIds]])

  const anyLoading: boolean = useMemo(() => balanceOfBatch.loading, [balanceOfBatch])

  return useMemo(
    () => [
      attrIds && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, item, i) => {
          const value = balanceOfBatch.result?.[0]
          const amount = value ? JSBI.BigInt(value.toString()) : undefined
          if (amount) {
            memo[item.token.address] = CurrencyAmount.fromRawAmount(item.token, amount)
          }
          return memo
        }, {})
        : {},
      anyLoading
    ],
    [attrIds, validatedTokens, anyLoading, balanceOfBatch]
  )

}

export function useTokenBalancesERC3664(
  tokenContractAddress?: string,
  tokenId?: string,
  tokens?: (Token | undefined)[],
  attrIds?: (string | number | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicatorERC3664(tokenContractAddress, tokenId, tokens, attrIds)[0]
}

export function useTokenBalanceERC3664(tokenContractAddress?: string, tokenId?: string, token?: Token, attrId?: string | number): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalancesERC3664(
    tokenContractAddress,
    tokenId,
    [token],
    [attrId]
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}

*/

// export function useTokenBalanceERC3664(tokenId?: string | number, attrId?: number, contractAddress?: string): BigNumber | undefined {
//   const contract = useERC3664Contract(contractAddress)
//   return useSingleCallResult(contract, 'balanceOf', [tokenId, attrId])?.result?.[0]
// }

export function useTokenBalanceERC3664(token?: Currency, tokenId?: string | number, attrId?: string | number): CurrencyAmount<Token> | undefined {
  const contract = useTokenContractERC3664(token?.isToken ? token.address : undefined, false)
  const balance: BigNumber = useSingleCallResult(contract, 'balanceOf', [tokenId, attrId])?.result?.[0]
  return token?.isToken && balance ? CurrencyAmount.fromRawAmount(token, balance.toString()) : undefined
}

