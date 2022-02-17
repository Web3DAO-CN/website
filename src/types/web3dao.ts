import { BigNumber } from '@ethersproject/bignumber'

export interface LockVaultT {
  sponsorAmount: BigNumber;
  stakeAmount: BigNumber;
  borrowGasAmount: BigNumber;
  time: BigNumber;
}
