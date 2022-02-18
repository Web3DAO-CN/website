import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTokenContract, useTokenContractERC2664 } from 'hooks/useContract'
import { useTokenAllowance, useTokenAllowanceERC3664 } from 'hooks/useTokenAllowance'
import { useCallback, useMemo } from 'react'
import { calculateGasMargin } from 'utils/calculateGasMargin'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

export function useApprovalStateForSpender(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  spender: string | undefined,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean
): ApprovalState {
  const { account } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useIsPendingApproval(token, spender)

  return useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])
}

export function useApproval(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  spender: string | undefined,
  useIsPendingApproval: (token?: Token, spender?: string) => boolean
): [
  ApprovalState,
  () => Promise<{ response: TransactionResponse; tokenAddress: string; spenderAddress: string } | undefined>
] {
  const { chainId } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  // check the current approval status
  const approvalState = useApprovalStateForSpender(amountToApprove, spender, useIsPendingApproval)

  const tokenContract = useTokenContract(token?.address)

  const approve = useCallback(async () => {
    function logFailure(error: Error | string): undefined {
      console.warn(`${token?.symbol || 'Token'} approval failed:`, error)
      return
    }

    // Bail early if there is an issue.
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      return logFailure('approve was called unnecessarily')
    } else if (!chainId) {
      return logFailure('no chainId')
    } else if (!token) {
      return logFailure('no token')
    } else if (!tokenContract) {
      return logFailure('tokenContract is null')
    } else if (!amountToApprove) {
      return logFailure('missing amount to approve')
    } else if (!spender) {
      return logFailure('no spender')
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens which restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    return tokenContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response) => ({
        response,
        tokenAddress: token.address,
        spenderAddress: spender
      }))
      .catch((error: Error) => {
        logFailure(error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, spender, chainId])

  return [approvalState, approve]
}

export function useApprovalStateERC3664(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  fromTokenId: string | undefined,
  toTokenId: string | undefined,
  attrId: string | undefined,
  useIsPendingApproval: (token?: Token, fromTokenId?: string, toTokenId?: string, attrId?: string) => boolean
): ApprovalState {
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  const currentAllowance = useTokenAllowanceERC3664(token, fromTokenId, toTokenId, attrId)
  const pendingApproval = useIsPendingApproval(token, fromTokenId, toTokenId, attrId)

  return useMemo(() => {
    if (!amountToApprove || !fromTokenId || !toTokenId || !attrId) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, fromTokenId, toTokenId, attrId])
}

export function useApprovalERC3664(
  amountToApprove: CurrencyAmount<Currency> | undefined,
  fromTokenId: string | undefined,
  toTokenId: string | undefined,
  attrId: string | undefined,
  useIsPendingApproval: (token?: Token, fromTokenId?: string, toTokenId?: string, attrId?: string) => boolean
): [
  ApprovalState,
  () => Promise<{ response: TransactionResponse; tokenAddress: string; fromTokenId: string; toTokenId: string; attrId: string } | undefined>
] {
  const { chainId } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined

  // check the current approval status
  const approvalState = useApprovalStateERC3664(amountToApprove, fromTokenId, toTokenId, attrId, useIsPendingApproval)

  const tokenContract = useTokenContractERC2664(token?.address)

  const approve = useCallback(async () => {
    function logFailure(error: Error | string): undefined {
      console.warn(`${token?.symbol || 'Token'} approval failed:`, error)
      return
    }

    // Bail early if there is an issue.
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      return logFailure('approve was called unnecessarily')
    } else if (!chainId) {
      return logFailure('no chainId')
    } else if (!token) {
      return logFailure('no token')
    } else if (!tokenContract) {
      return logFailure('tokenContract is null')
    } else if (!amountToApprove) {
      return logFailure('missing amount to approve')
    } else if (!fromTokenId) {
      return logFailure('no fromTokenId')
    } else if (!toTokenId) {
      return logFailure('no toTokenId')
    } else if (!attrId) {
      return logFailure('no attrId')
    }

    let useExact = false
    const estimatedGas = await tokenContract.estimateGas.approve(fromTokenId, toTokenId, attrId, MaxUint256).catch(() => {
      // general fallback for tokens which restrict approval amounts
      useExact = true
      return tokenContract.estimateGas.approve(fromTokenId, toTokenId, attrId, amountToApprove.quotient.toString())
    })

    return tokenContract
      .approve(fromTokenId, toTokenId, attrId, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas)
      })
      .then((response) => ({
        response,
        tokenAddress: token.address,
        fromTokenId,
        toTokenId,
        attrId
      }))
      .catch((error: Error) => {
        logFailure(error)
        throw error
      })
  }, [approvalState, token, tokenContract, amountToApprove, fromTokenId, toTokenId, attrId, chainId])

  return [approvalState, approve]
}
