import { PopupContent } from '../../state/application/reducer'
import TransactionPopup from './TransactionPopup'
import { toast } from 'react-toastify'
import FailedNetworkSwitchPopup from './FailedNetworkSwitchPopup'
import { useState } from 'react'
import { CaretDown } from 'components/FontawesomeIcon'

function PopupContentItem({ content }: {
  content: PopupContent
  popKey: string
}) {
  let popupContent
  if ('txn' in content) {
    const { txn: { hash } } = content
    popupContent = <TransactionPopup hash={hash} />
  } else if ('failedSwitchNetwork' in content) {
    popupContent = <FailedNetworkSwitchPopup chainId={content.failedSwitchNetwork} />
  }
  return (
    <>
      {popupContent}
    </>
  )
}

export function popupToast({ content, popKey, removeAfterMs }: {
  content: PopupContent
  popKey: string
  removeAfterMs: number
}) {
  toast(
    <PopupContentItem key={popKey} content={content} popKey={popKey} />,
    { autoClose: removeAfterMs ?? 10000 }
  )
}

const ExpandableMessage = ({ message }: { message: string }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className='flex items-end'>
      <span className={`${isExpanded ? '' : 'truncate '}text-xs text-[#415BE5]`}>{message}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex items-center justify-center'
      >
        <CaretDown className={`${isExpanded ? '-rotate-180 ' : ''}`} />
      </button>
    </div>
  )
}

export function popupToastError({ message, removeAfterMs }: {
  message: string
  removeAfterMs: number
}) {
  const content = (
    <>
      <div className='mb-2 font-semibold text-sm text-[#211B39]'>失败</div>
      {message.length <= 16
        ? <span className='text-xs text-[#415BE5]'>{message}</span>
        : <ExpandableMessage message={message} />
      }
    </>
  )
  toast.error(content, {
    autoClose: removeAfterMs ?? 10000
  })
}
