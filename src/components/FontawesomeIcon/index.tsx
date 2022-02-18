import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

function BaseIcon({ ...rest }: FontAwesomeIconProps | any) {
  // const [darkMode] = useDarkModeManager()
  // if (darkMode === undefined || darkMode === null) {
  //   return null
  // }
  //
  let styleHW = {}
  const _size = (rest.size + '').replace(/[^\d]/g, '')

  if (rest && parseInt(_size) > 0) {
    styleHW = { width: _size + 'px', height: _size + 'px' }
    rest.size = undefined
  } else {
    styleHW = { width: '16px', height: '16px' }
  }
  rest.style = rest.style ? { ...styleHW, ...rest.style } : { ...styleHW }
  //
  return (
    <FontAwesomeIcon {...rest} />
  )
}

export function Github({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'github']} />
}

export function Discord({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'discord']} />
}

// export function Language({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'language']} />
//   )
// }

export function Globe({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'globe']} />
}

export function Book({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'book']} />
}

export function LayerGroup({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'layer-group']} />
}

// export function MapSigns({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'map-signs']} />
//   )
// }

export function ExchangeAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'exchange-alt']} />
}

export function ChartLine({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'chart-line']} />
}

export function InfoCircle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'info-circle']} />
}

// export function LightbulbR({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <FontAwesomeIcon style={{ width: '20px', height: '20px' }} {...rest} icon={['far', 'lightbulb']} />
//   )
// }

// export function LightbulbS({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <FontAwesomeIcon style={{ width: '20px', height: '20px' }} {...rest} icon={['fas', 'lightbulb']} />
//   )
// }

export function ExternalLinkAlt({ ...rest }: FontAwesomeIconProps | any) {
  return (
    <BaseIcon {...rest} style={{ width: '12px', height: '12px', ...rest?.style }} icon={['fas', 'external-link-alt']} />
  )
}

// export function ArrowUp({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon{...rest} icon={['fas', 'arrow-up']} />
//   )
// }

export function ArrowDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'arrow-down']} />
}

export function ArrowLeft({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'arrow-left']} />
}

export function ArrowRight({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'arrow-right']} />
}

// export function ChevronLeft({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'chevron-left']} />
//   )
// }

export function ChevronRight({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'chevron-right']} />
}

export function ChevronDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'chevron-down']} />
}

export function ChevronUp({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'chevron-up']} />
}

export function AngleDoubleDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'angle-double-down']} />
}

export function ArrowAltCircleDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'arrow-alt-circle-down']} />
}

export function Check({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'check']} />
}

export function CheckCircle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'check-circle']} />
}

export function CheckCircleSolid({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'check-circle']} />
}

export function ExclamationTriangle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'exclamation-triangle']} />
}

export function CircleExclamation({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'circle-exclamation']} />
}

export function ExclamationCircle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'exclamation-circle']} />
}

// export function Exclamation({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'exclamation']} />
//   )
// }

export function ArrowAltCircleUp({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'arrow-alt-circle-up']} />
}

export function PlaneDeparture({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'plane-departure']} />
}

export function PlaneSlash({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'plane-slash']} />
}

export function PhoneSlash({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'phone-slash']} />
}

export function ListUl({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} style={{ width: '20px', height: '20px', ...rest?.style }} icon={['fas', 'list-ul']} />
}

export function Moon({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'moon']} />
}

export function Sun({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'sun']} />
}

export function UserCog({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} style={{ width: '24px', height: '24px', ...rest?.style }} icon={['fas', 'user-cog']} />
}

export function UserAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'user-alt']} />
}

export function AddressCard({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'address-card']} />
}

export function SignOutAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'sign-out-alt']} />
}

export function ChessQueen({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'chess-queen']} />
}

// export function Cog({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'cog']} />
//   )
// }

export function Times({ ...rest }: FontAwesomeIconProps | any) {
  return (
    <BaseIcon {...rest} style={{ width: '20px', height: '20px', ...rest?.style }} {...rest} icon={['fas', 'times']} />
  )
}

export function TimesCircle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'times-circle']} size={20} />
}

export function QuestionCircle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'question-circle']} />
}

export function Copy({ ...rest }: FontAwesomeIconProps | any) {
  return (
    <BaseIcon {...rest} style={{ width: '12px', height: '12px', ...rest?.style }} {...rest} icon={['far', 'copy']} />
  )
}

export function SyncAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'sync-alt']} spin />
}

// export function Trash({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'trash']} />
//   )
// }

export function TrashAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'trash-alt']} />
}

export function Ban({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'ban']} />
}

export function UserEdit({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'user-edit']} />
}

export function Edit({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'edit']} />
}

export function Lock({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'lock']} />
}

export function Ethereum({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'ethereum']} />
}

export function Plus({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'plus']} />
}

export function Minus({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'minus']} />
}

// export function PlusCircle({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'plus-circle']} />
//   )
// }

// export function MinusCircle({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'minus-circle']} />
//   )
// }

export function PiggyBank({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'piggy-bank']} />
}

export function GrinBeamSweat({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'grin-beam-sweat']} />
}

export function BatteryEmpty({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'battery-empty']} />
}

export function Search({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'search']} />
}

export function SearchMinus({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'search-minus']} />
}

export function SearchPlus({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'search-plus']} />
}

export function Retweet({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'retweet']} />
}

export function Heart({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'heart']} />
}

export function Heartbeat({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'heartbeat']} />
}

export function Eye({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'eye']} />
}

export function EyeSlash({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'eye-slash']} />
}

// export function Link({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'link']} />
//   )
// }

// export function Tools({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'tools']} />
//   )
// }

// export function Whmcs({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fab', 'whmcs']} />
//   )
// }

export function Paperclip({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'paperclip']} />
}

export function Medapps({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'medapps']} />
}

// export function Fingerprint({ ...rest }: FontAwesomeIconProps | any) {
//   return (
//     <BaseIcon {...rest} icon={['fas', 'fingerprint']} />
//   )
// }

export function Wallet({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'wallet']} />
}

export function DiceD6({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'dice-d6']} />
}

export function FileLines({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'file-lines']} />
}

export function MugHot({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'mug-hot']} />
}

export function CircleQuestion({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'circle-question']} />
}

export function CircleInfo({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'circle-info']} />
}

export function Circle({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'circle']} />
}

export function CircleNotch({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'circle-notch']} spin />
}

export function Clock({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'clock']} />
}

export function PenNib({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'pen-nib']} />
}

export function Walking({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'walking']} />
}

export function Clone({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'clone']} />
}

export function AngleDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'angle-down']} />
}

export function Cubes({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'cubes']} />
}

export function Shapes({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'shapes']} />
}

export function Archive({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'archive']} />
}

export function CalendarCheck({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'calendar-check']} />
}

export function ShoppingCart({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'shopping-cart']} />
}

export function CommentDots({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'comment-dots']} />
}

export function Link({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'link']} />
}

export function Clipboard({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'clipboard']} />
}

export function CalendarMinus({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'calendar-minus']} />
}

export function HandsHelping({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'hands-helping']} />
}

export function AngleDoubleRight({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'angle-double-right']} />
}

export function Star({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'star']} />
}

export function StarLine({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'star']} />
}

export function StickyNote({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'sticky-note']} />
}

export function Hammer({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'hammer']} />
}

export function HandLizard({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'hand-lizard']} />
}

export function Codepen({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'codepen']} />
}

export function Braille({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'braille']} />
}

export function Tags({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'tags']} />
}

export function Folder({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'folder']} />
}

export function Flag({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'flag']} />
}

export function LifeRing({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'life-ring']} />
}

export function FileAlt({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'file-alt']} />
}

export function Award({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'award']} />
}

export function VoteYea({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'vote-yea']} />
}

export function Buromobelexperte({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fab', 'buromobelexperte']} />
}

export function At({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'at']} />
}

export function History({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'history']} />
}

export function ToiletPaperSlash({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'toilet-paper-slash']} />
}

export function Redo({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'redo']} />
}

export function SlidersH({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'sliders-h']} />
}

export function ArrowsAltV({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'arrows-alt-v']} />
}

export function Wifi({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'wifi']} />
}

export function Atlas({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'atlas']} />
}

export function CaretDown({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'caret-down']} />
}

export function Sort({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'sort']} />
}

export function ArrowUpRightFromSquare({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'arrow-up-right-from-square']} />
}

export function Expand({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'expand']} />
}

export function CreditCard({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'credit-card']} />
}

export function Repeat({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'repeat']} />
}

export function Donate({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'donate']} />
}

export function HandHoldingDroplet({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['fas', 'hand-holding-droplet']} />
}

export function IdCardFar({ ...rest }: FontAwesomeIconProps | any) {
  return <BaseIcon {...rest} icon={['far', 'id-card']} />
}
