import { Trans } from '@lingui/macro'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'
import { CloseIcon, ExternalLink, ThemedText } from '../../theme'
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink'
import { AutoColumn, ColumnCenter } from '../Column'
import { RowBetween } from '../Row'
import { ArrowAltCircleUp, SyncAlt } from '../FontawesomeIcon'

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`

export function LoadingView({ children, onDismiss }: { children: any; onDismiss: () => void }) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        {/*<CustomLightSpinner src={Circle} alt="loader" size={'90px'} />*/}
        <SyncAlt size={90} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        <ThemedText.SubHeader>
          <Trans>Confirm this transaction in your wallet</Trans>
        </ThemedText.SubHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any
  onDismiss: () => void
  hash: string | undefined
}) {
  const theme = useContext(ThemeContext)
  const { chainId } = useActiveWeb3React()

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <ArrowAltCircleUp strokeWidth={0.5} size={90} color={theme.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={'center'}>
        {children}
        {chainId && hash && (
          <ExternalLink
            href={getExplorerLink(chainId, hash, ExplorerDataType.TRANSACTION)}
            style={{ marginLeft: '4px' }}
          >
            <ThemedText.SubHeader>
              <Trans>View transaction on Explorer</Trans>
            </ThemedText.SubHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  )
}
