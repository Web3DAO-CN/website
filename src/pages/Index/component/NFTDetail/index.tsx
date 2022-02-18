import { AttrIdEnum, AttrIdProp, BLOCK_TOKEN, GAS_TOKEN, NONCE_TOKEN, SPONSOR_TOKEN, TX_TOKEN, WEB3_DAO_CN_ATTR } from '../../../../constants/web3dao'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { useTotalSupplyERC3664 } from '../../../../hooks/useTotalSupply'
import useActiveWeb3React from '../../../../hooks/useActiveWeb3React'
import { useTokenBalanceERC3664 } from '../../../../lib/hooks/useCurrencyBalance'

export interface AttrIdPropExt extends AttrIdProp {
  totalSupply?: CurrencyAmount<Currency>
  balance?: CurrencyAmount<Currency>,
  actionColList?: {
    actionLabel?: string,
    path?: string
  }[]
}

export default function NFTDetail({ tokenId }: { tokenId: string }) {

  const { chainId } = useActiveWeb3React()

  const list: AttrIdPropExt[] = []

  const gasToken = chainId ? GAS_TOKEN[chainId] : undefined
  const attrGas: AttrIdPropExt = WEB3_DAO_CN_ATTR[AttrIdEnum.gas]
  attrGas.totalSupply = useTotalSupplyERC3664(gasToken, AttrIdEnum.gas)
  attrGas.balance = useTokenBalanceERC3664(gasToken, tokenId, AttrIdEnum.gas)
  attrGas.actionColList = tokenId ?
    [{ actionLabel: '借出', path: '#/borrowGas' },
      { actionLabel: '归还', path: '#/returnGas' }]
    : undefined
  list.push(attrGas)

  const blockToken = chainId ? BLOCK_TOKEN[chainId] : undefined
  const attrBlock: AttrIdPropExt = WEB3_DAO_CN_ATTR[AttrIdEnum.block]
  attrBlock.totalSupply = useTotalSupplyERC3664(blockToken, AttrIdEnum.block)
  attrBlock.balance = useTokenBalanceERC3664(blockToken, tokenId, AttrIdEnum.block)
  list.push(attrBlock)

  const nonceToken = chainId ? NONCE_TOKEN[chainId] : undefined
  const attrNonce: AttrIdPropExt = WEB3_DAO_CN_ATTR[AttrIdEnum.nonce]
  attrNonce.totalSupply = useTotalSupplyERC3664(nonceToken, AttrIdEnum.nonce)
  attrNonce.balance = useTokenBalanceERC3664(nonceToken, tokenId, AttrIdEnum.nonce)
  list.push(attrNonce)

  const txToken = chainId ? TX_TOKEN[chainId] : undefined
  const attrTx: AttrIdPropExt = WEB3_DAO_CN_ATTR[AttrIdEnum.tx]
  attrTx.totalSupply = useTotalSupplyERC3664(txToken, AttrIdEnum.tx)
  attrTx.balance = useTokenBalanceERC3664(txToken, tokenId, AttrIdEnum.tx)
  list.push(attrTx)

  const sponsorToken = chainId ? SPONSOR_TOKEN[chainId] : undefined
  const attrSponsor: AttrIdPropExt = WEB3_DAO_CN_ATTR[AttrIdEnum.sp]
  attrSponsor.totalSupply = useTotalSupplyERC3664(sponsorToken, AttrIdEnum.sp)
  attrSponsor.balance = useTokenBalanceERC3664(sponsorToken, tokenId, AttrIdEnum.sp)
  attrSponsor.actionColList = tokenId
    ? [{
      actionLabel: '赞助', path: '#/sponsor'
    }] : undefined
  list.push(attrSponsor)

  return (
    <div className='mt-10 divide-y divide-gray-200'>
      <div className='space-y-1'>
        <h3 className='text-lg leading-6 font-medium text-gray-900'>
          我的NFT
        </h3>
        <p className='max-w-2xl text-sm text-gray-500'>
          {
            tokenId
              ? `TokenId【${tokenId}】明细`
              :
              <>
                您尚未拥有自己的NFT，<a href='#/buyNFT' className='text-indigo-600 hover:text-indigo-900'>前往购买</a>
              </>
          }
        </p>
      </div>
      <div className='mt-4 flex flex-col'>
        <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
            <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    Name
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    Symbol
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    Decimal
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    TotalSupply
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    Balance
                  </th>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    操作
                  </th>
                </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {
                    list.map((item, index) => (
                      <tr key={index}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {item.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {item.symbol}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {item.decimal}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {item.totalSupply?.toSignificant(3)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {item.balance?.toSignificant(3)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center'>
                          {
                            item.actionColList?.map((item, index) => (
                              <a key={index}
                                 href={item.path}
                                 className='text-indigo-600 hover:text-indigo-900 mr-1'
                              >
                                {item.actionLabel}
                              </a>
                            ))
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
