import React from 'react'

import { escapeRegExp } from '../../utils'

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
                                                      value,
                                                      onUserInput,
                                                      inputMode = 'decimal',
                                                      placeholder,
                                                      prependSymbol,
                                                      ...rest
                                                    }: {
  value: string | number
  onUserInput: (input: string) => void
  inputMode?: 'numeric' | 'decimal'
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
  prependSymbol?: string | undefined
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {

  /*const [userInputValue, setUserInputValue] = useState<string>('')
  const userInputValueDebounced = useDebounce(userInputValue, 200)
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      //onUserInput(nextUserInput)
      setUserInputValue(nextUserInput)
    }
  }
  useEffect(() => {
    onUserInput(userInputValueDebounced)
  }, [userInputValueDebounced, onUserInput])*/

  const enforcer = (nextUserInput: string) => {

    let _nextUserInput = nextUserInput

    if (inputMode === 'numeric' && nextUserInput.indexOf('.') > 0) {
      _nextUserInput = nextUserInput.substring(0, nextUserInput.indexOf('.'))
    }

    if (_nextUserInput === '' || inputRegex.test(escapeRegExp(_nextUserInput))) {
      onUserInput(_nextUserInput)
    }
  }

  const pattern = inputMode === 'decimal' ? '^[0-9]*[.,]?[0-9]*$' : '^[0-9]*$'

  return (
    <input
      {...rest}
      value={prependSymbol && value ? prependSymbol + value : value}
      onChange={(event) => {
        if (prependSymbol) {
          const value = event.target.value
          // cut off prepended symbol
          const formattedValue = value.toString().includes(prependSymbol)
            ? value.toString().slice(1, value.toString().length + 1)
            : value
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(formattedValue.replace(/,/g, '.'))
        } else {
          enforcer(event.target.value.replace(/,/g, '.'))
        }
      }}
      // universal input options
      inputMode={inputMode}
      autoComplete='off'
      autoCorrect='off'
      // text-specific options
      type='text'
      pattern={pattern}
      placeholder={placeholder || '0.0'}
      minLength={1}
      maxLength={79}
      spellCheck='false'
    />
  )
})

export default Input

// const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
