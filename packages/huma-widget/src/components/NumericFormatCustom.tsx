import React from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  suffix?: string
}

export const NumericFormatCustom = React.forwardRef<
  NumericFormatProps,
  CustomProps
>((props, ref) => {
  const { onChange, suffix, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator
      valueIsNumericString
      suffix={suffix}
    />
  )
})
