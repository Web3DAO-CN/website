import classNames from 'utils/classNames'
import Countdown, { CountdownRenderProps } from 'react-countdown'

function Digit({ digit, label, small }: { digit: number; label: string; small?: boolean }) {
  return (
    <div className='flex flex-col items-center'>
      <div
        className={classNames(
          small ? 'w-[30px] h-[30px]' : 'w-9 h-9',
          'flex items-center justify-center bg-[#32364B] text-white rounded-lg'
        )}
      >
        <span className={classNames(small ? 'text-sm' : 'text-xl', 'font-semibold')}>{digit}</span>
      </div>
      <span className={classNames(small ? 'text-[11px] mt-1' : 'text-xs mt-[5px]', 'text-[#A5A2B0] font-semibold ml-2')}>{label}</span>
    </div>
  )
}

function Divider({ small }: { small?: boolean }) {
  return (
    <span className={classNames(small ? 'h-[30px]' : 'h-9', 'w-5 flex flex-col items-center justify-center gap-2')}>
      <span className='block w-1 h-1 rounded-full bg-[#32364B]' />
      <span className='block w-1 h-1 rounded-full bg-[#32364B]' />
    </span>
  )
}

export default function CountdownExt({
                                       milliseconds = 0,
                                       small,
                                       raw,
                                       element
                                     }: {
  milliseconds: number | undefined;
  small?: boolean;
  raw?: boolean;
  element?: any
}) {

  //console.log('milliseconds = %s ', milliseconds)

  const Completion = () => <span></span>
  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return element ? element : <Completion />
    } else {
      if (raw) {
        return (
          <>
            {days}天 {hours}小时 {minutes}分钟 {seconds}秒
          </>
        )
      }

      if (small) {
        return (
          <div className='flex'>
            <Digit digit={days} label='天' small />
            <Divider small />
            <Digit digit={hours} label='时' small />
            <Divider small />
            <Digit digit={minutes} label='分' small />
            <Divider small />
            <Digit digit={seconds} label='秒' small />
          </div>
        )
      }
      return (
        <div className='flex'>
          <Digit digit={days} label='天' />
          <Divider />
          <Digit digit={hours} label='时' />
          <Divider />
          <Digit digit={minutes} label='分' />
          <Divider />
          <Digit digit={seconds} label='秒' />
        </div>
      )
    }
  }
  return (
    <Countdown date={milliseconds} renderer={renderer} />
  )
}
