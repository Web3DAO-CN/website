import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'

import { useTransaction } from '../../state/transactions/hooks'
import { ExternalLink, ThemedText } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { TransactionSummary } from '../AccountDetails/TransactionSummary'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { CheckCircle, ExclamationCircle } from "../FontawesomeIcon";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({ hash }: { hash: string }) {
  const { chainId } = useActiveWeb3React()

  const tx = useTransaction(hash)
  const theme = useContext(ThemeContext)

  if (!tx) return null
  const success = Boolean(tx.receipt && tx.receipt.status === 1)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success
          ? <CheckCircle size={24} style={{ color: theme.green1 }} />
          : <ExclamationCircle size={24} style={{ color: theme.red1 }} />
        }
      </div>
      <AutoColumn gap="8px">
        <ThemedText.Body fontWeight={500}>
          <TransactionSummary info={tx.info} />
        </ThemedText.Body>
        {chainId && (
          <ExternalLink href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}>
            View on Explorer
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
