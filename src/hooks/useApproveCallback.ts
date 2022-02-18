import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { ApprovalState, useApproval, useApprovalERC3664 } from 'lib/hooks/useApproval'
import { useCallback } from 'react'

import { TransactionType } from '../state/transactions/actions'
import { useHasPendingApproval, useHasPendingApprovalERC3664, useTransactionAdder } from '../state/transactions/hooks'

export { ApprovalState } from 'lib/hooks/useApproval'

function useGetAndTrackApproval(getApproval: ReturnType<typeof useApproval>[1]) {
  const addTransaction = useTransactionAdder()
  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        const { response, tokenAddress, spenderAddress: spender } = pending
        addTransaction(response, { type: TransactionType.APPROVAL, tokenAddress, spender })
      }
    })
  }, [addTransaction, getApproval])
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApproval(amountToApprove, spender, useHasPendingApproval)
  return [approval, useGetAndTrackApproval(getApproval)]
}

function useGetAndTrackApprovalERC3664(getApproval: ReturnType<typeof useApprovalERC3664>[1]) {
  const addTransaction = useTransactionAdder()
  return useCallback(() => {
    return getApproval().then((pending) => {
      if (pending) {
        const { response, tokenAddress, fromTokenId, toTokenId, attrId } = pending
        addTransaction(response, { type: TransactionType.APPROVAL_ERC3664, tokenAddress, fromTokenId, toTokenId, attrId })
      }
    })
  }, [addTransaction, getApproval])
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallbackERC3664(
  amountToApprove?: CurrencyAmount<Currency>,
  fromTokenId?: string,
  toTokenId?: string,
  attrId?: string
): [ApprovalState, () => Promise<void>] {
  const [approval, getApproval] = useApprovalERC3664(amountToApprove, fromTokenId, toTokenId, attrId, useHasPendingApprovalERC3664)
  return [approval, useGetAndTrackApprovalERC3664(getApproval)]
}
