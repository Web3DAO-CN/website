import { Connector } from '@web3-react/types'
import { AbstractConnector } from 'web3-react-abstract-connector'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { injected, walletconnect } from '../../connectors'
import Identicon from '../Identicon'

export default function StatusIcon({ connector }: { connector: AbstractConnector | Connector }) {
  switch (connector) {
    case injected:
      return <Identicon />
    case walletconnect:
      return <img src={WalletConnectIcon} alt={'WalletConnect'} />
    // case walletlink:
    //   return <img src={CoinbaseWalletIcon} alt={'Coinbase Wallet'} />
    // case fortmatic:
    //   return <img src={FortmaticIcon} alt={'Fortmatic'} />
    // case portis:
    //   return <img src={PortisIcon} alt={'Portis'} />
    default:
      return null
  }
}
