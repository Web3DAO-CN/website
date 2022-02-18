import { useMemo } from 'react'

import { useSingleCallResult } from 'lib/hooks/multicall'
import { useDaoSponsor } from '../useContract'
import { LockVaultT } from '../../types/web3dao'
import { BigNumber } from '@ethersproject/bignumber'
import { AttrIdEnum, GAS_TOKEN, SPONSOR_TOKEN } from '../../constants/web3dao'
import { useReserve } from './useDaoVaultContract'
import { useGasAttrPrice } from './useDaoTreasuryContract'
import { useERC20CurrencyAmount } from '../../lib/hooks/useNativeCurrency'
import useActiveWeb3React from '../useActiveWeb3React'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useTotalSupplyERC3664 } from '../useTotalSupply'

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

  const { chainId } = useActiveWeb3React()

  const gasToken = chainId ? GAS_TOKEN[chainId] : undefined
  const sponsorToken = chainId ? SPONSOR_TOKEN[chainId] : undefined

  console.log('\n\n\n')

  // NFT合约的 sponsor attr总发行量
  const sponsorTotalSupply = useTotalSupplyERC3664(sponsorToken, AttrIdEnum.sp)
  console.log('sponsorTotalSupply = %s', sponsorTotalSupply?.toString())

  // DaoVault储备量
  const daoVaultReserve = useReserve()
  console.log('daoVaultReserve = %s', daoVaultReserve?.toString())

  // gas和eth兑换比例
  const daoTreasuryGasAttrPrice = useGasAttrPrice()
  console.log('daoTreasuryGasAttrPrice = %s', daoTreasuryGasAttrPrice?.toString())

  //实例化锁仓结构体
  const lockVault = useLockVault(tokenId)
  const borrowGasAmountCurrencyAmount = useERC20CurrencyAmount(lockVault?.borrowGasAmount.toString(), gasToken)
  console.log('borrowGasAmountCurrencyAmount = %s', borrowGasAmountCurrencyAmount?.toExact())

  console.log('lockVault.borrowGasAmount = %s', lockVault?.borrowGasAmount.toString())
  console.log('lockVault.sponsorAmount = %s', lockVault?.sponsorAmount.toString())

  // 计算sponsorAmount总价值对应的ethAmount
  const ethAmount = useMemo(() => {
    if (lockVault?.sponsorAmount && daoVaultReserve && sponsorTotalSupply?.greaterThan(0)) {
      return lockVault?.sponsorAmount.mul(daoVaultReserve).div(sponsorTotalSupply?.quotient.toString())
    } else {
      return BigNumber.from(0)
    }
  }, [lockVault, daoVaultReserve, sponsorTotalSupply])
  console.log('ethAmount = %s', ethAmount?.toString())

  //
  const gasTotalAmount = useMemo(() => {
    if (ethAmount && daoTreasuryGasAttrPrice) {
      return ethAmount.mul(daoTreasuryGasAttrPrice)
    } else {
      return BigNumber.from(0)
    }
  }, [ethAmount, daoTreasuryGasAttrPrice])
  const gasTotalAmountCurrencyAmount = useERC20CurrencyAmount(gasTotalAmount?.toString(), gasToken)
  console.log('totalAmountCurrencyAmount = %s', gasTotalAmountCurrencyAmount?.toExact())

  const daoSponsorMaxBorrow = useMaxBorrow()
  const daoSponsorMax = useMax()

  console.log('daoSponsorMaxBorrow = %s', daoSponsorMaxBorrow?.toString())
  console.log('daoSponsorMax = %s', daoSponsorMax?.toString())

  /*const borrowPercent = useMemo(() => {
    if (daoSponsorMaxBorrow?.gt(0) && daoSponsorMax?.gt(0)) {
      return new Percent(daoSponsorMaxBorrow.toString(), daoSponsorMax.toString())
    } else {
      return new Percent(1, 1)
    }
  }, [daoSponsorMaxBorrow, daoSponsorMax])
  console.log('borrowPercent = %s', borrowPercent?.toFixed(6))*/

  //可借出GAS
  const availableBorrowGas = useMemo(() => {
    if (borrowGasAmountCurrencyAmount
      && daoSponsorMaxBorrow?.gt(0)
      && daoSponsorMax?.gt(0)
      && gasTotalAmountCurrencyAmount?.greaterThan(0)) {
      //
      // const gasTotalAmountCurrencyAmountFraction = gasTotalAmountCurrencyAmount?.asFraction
      // const borrowPercent = new Fraction(daoSponsorMaxBorrow.toString(), daoSponsorMax.toString())
      //
      // return gasTotalAmountCurrencyAmount?.multiply(daoSponsorMaxBorrow?.toNumber()).subtract(borrowGasAmountCurrencyAmount.multiply(daoSponsorMax?.toNumber()))
      return gasTotalAmountCurrencyAmount?.subtract(borrowGasAmountCurrencyAmount)
    } else {
      return undefined
    }
  }, [gasTotalAmountCurrencyAmount, daoSponsorMaxBorrow, daoSponsorMax, borrowGasAmountCurrencyAmount])
  //
  // return useERC20CurrencyAmount(availableBorrowGas?.quotient.toString(), gasToken)
  return availableBorrowGas
}
