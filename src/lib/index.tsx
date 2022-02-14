import Widget, { WidgetProps } from './components/Widget'

export { SUPPORTED_LOCALES } from 'constants/locales'

type SwapWidgetProps = WidgetProps

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props} />
  )
}
