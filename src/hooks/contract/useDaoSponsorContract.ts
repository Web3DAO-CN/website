import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoSponsor } from '../useContract'
import { LockVaultT } from '../../types/web3dao'
import { BigNumber } from '@ethersproject/bignumber'
import { useTotalSupplyByAttrId } from './useERC2664Contract'
import { AttrIdEnum } from '../../constants/web3dao'
import { useReserve } from './useDaoVaultContract'
import { useGasAttrPrice } from './useDaoTreasuryContract'
import { useNativeCurrencyAmount } from '../../lib/hooks/useNativeCurrency'
import { Currency, CurrencyAmount, Percent } from '@uniswap/sdk-core'

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

export function useMaxBorrow(): BigNumber | undefined {
  const contract = useDaoSponsor()
  const result = useSingleCallResult(contract, 'maxBorrow')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}

export function useMax(): BigNumber | undefined {
  const contract = useDaoSponsor()
  const result = useSingleCallResult(contract, 'max')?.result?.[0]
  return useMemo(() => {
    return result ? result : undefined
  }, [result])
}

export function useAvailableBorrowGas(tokenId?: string): CurrencyAmount<Currency> | undefined {
  // NFT合约的 sponsor attr总发行量
  const erc3664TotalSupply = useTotalSupplyByAttrId(AttrIdEnum.sp)
  // DaoVault储备量
  const daoVaultReserve = useReserve()
  // gas和eth兑换比例
  const daoTreasuryGasAttrPrice = useGasAttrPrice()
  //实例化锁仓结构体
  const lockVault = useLockVault(tokenId)
  // 计算sponsorAmount总价值对应的ethAmount
  const ethAmount = useMemo(() => {
    if (lockVault?.sponsorAmount.gt(0) && daoVaultReserve?.gt(0) && erc3664TotalSupply?.gt(0)) {
      return lockVault?.sponsorAmount.mul(daoVaultReserve).div(erc3664TotalSupply)
    } else {
      return undefined
    }
  }, [lockVault, daoVaultReserve, erc3664TotalSupply])
  const borrowGasAmountCurrencyAmount = useNativeCurrencyAmount(lockVault?.borrowGasAmount.toString())

  //
  const totalAmount = useMemo(() => {
    if (ethAmount && daoTreasuryGasAttrPrice) {
      return ethAmount.mul(daoTreasuryGasAttrPrice)
    } else {
      return undefined
    }
  }, [ethAmount, daoTreasuryGasAttrPrice])
  const totalAmountCurrencyAmount = useNativeCurrencyAmount(totalAmount?.toNumber())

  const daoSponsorMaxBorrow = useMaxBorrow()
  const daoSponsorMax = useMax()

  const borrowPercent = useMemo(() => {
    if (daoSponsorMaxBorrow?.gt(0) && daoSponsorMax?.gt(0)) {
      return new Percent(daoSponsorMaxBorrow.toNumber(), daoSponsorMax.toNumber())
    } else {
      return undefined
    }
  }, [daoSponsorMaxBorrow, daoSponsorMax])


  return useMemo(() => {
    if (borrowGasAmountCurrencyAmount && borrowPercent && totalAmountCurrencyAmount?.greaterThan(0)) {
      return totalAmountCurrencyAmount?.multiply(borrowPercent).subtract(borrowGasAmountCurrencyAmount)
    } else {
      return undefined
    }
  }, [totalAmountCurrencyAmount, borrowPercent, borrowGasAmountCurrencyAmount])
}
