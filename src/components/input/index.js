/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
import React, { PureComponent } from 'react'
import { Input } from 'antd'
import PropsType from 'prop-types'

const formatNumber = (price, defaultValue) => {
  if ((price && Number(price)) || price === 0) {
    return Intl.NumberFormat('en-US').format(Number(price))
  }
  return defaultValue || price
}

class InputInline extends PureComponent {
  constructor(props) {
    super(props)
    const { defaultValue, value, fixed } = props
    const values = (value?.toString() || defaultValue?.toString() || '')
      .toString()
      .split('.')

    let valueLast = values[1]
    if ((fixed || fixed === 0) && valueLast) {
      valueLast = values[1].substring(0, fixed)
    }
    this.state = {
      valueFirst: values[0]?.toString() || '',
      valueLast: valueLast?.toString() ? `.${valueLast}` : '',
      value: value?.toString() || defaultValue?.toString() || ''
    }
  }

  UNSAFE_componentWillReceiveProps(nProps) {
    const { value, type, fixed } = nProps
    const { valueFirst, valueLast, value: valueState } = this.state
    if (type === 'number') {
      if (
        value?.toString() !== `${valueFirst}${valueLast ? `.${valueLast}` : ''}`
      ) {
        const values = value?.toString().split('.') || []
        let valueLast = values[1]
        if ((fixed || fixed === 0) && valueLast) {
          valueLast = values[1].substring(0, fixed)
        }
        this.setState({
          valueFirst: values?.[0] || '',
          valueLast: valueLast ? `.${valueLast}` : ''
        })
      }
    } else if (value?.toString() !== valueState?.toString()) {
      this.setState({ value })
    }
  }

  handleChange = (e) => {
    const { onChange, type, min, max, fixed = 4 } = this.props
    let value = e.target.value || ''
    if (value === '.') {
      value = '0.'
    }
    if (value === '-.') {
      value = '-0.'
    }
    if (type === 'number') {
      value = value.replace(/[^0-9-.]/g, '').replace(/,/g, '')
      // tính toán số âm
      if (value.includes('-')) {
        if (value.replace(/[0-9.]/g, '').length % 2 === 0) {
          value = value.replace(/-/g, '')
        } else {
          value = `-${value.replace(/-/g, '')}`
        }
      }
      if ((min || min === 0) && Number(value || 0) < min) {
        return
      }
      if ((max || max === 0) && Number(value || 0) > max) {
        value = max.toString()
      }
      if (min && min >= 0) {
        value = value.replace(/-/g, '')
      }
      const values = value.split('.')
      const dot = value.includes('.') ? '.' : ''
      if (type === 'number') {
        if (
          (value.includes('.') && value.split('.')[1]) ||
          !value.includes('.')
        ) {
          onChange?.(value)
        }
      } else {
        onChange?.(value)
      }
      let valueLast = values[1]
      if ((fixed || fixed === 0) && valueLast) {
        valueLast = values[1].substring(0, fixed)
      }
      this.setState({
        valueFirst: values[0],
        valueLast: dot + (valueLast || '')
      })
    } else {
      onChange?.(e.target.value)
      this.setState({ value: e.target.value })
    }
  }

  onKeyDown = (e) => {
    if (
      e.keyCode === 189 ||
      e.keyCode === 187 ||
      e.keyCode === 107 ||
      e.keyCode === 109 ||
      e.keyCode === 69
    ) {
      e.preventDefault()
    }
  }

  render() {
    const { placeholder, type, disabled, style, className, ...p } = this.props
    const { valueFirst = '', valueLast = '', value = '' } = this.state

    return (
      <Input
        {...p}
        style={style}
        className={className}
        disabled={!!disabled}
        onChange={this.handleChange}
        value={
          type === 'number'
            ? formatNumber(valueFirst) + valueLast.toString()
            : value
        }
        placeholder={placeholder}
        onKeyDown={this.onKeyDown}
        autoComplete='off'
      />
    )
  }
}

InputInline.PropsType = {
  unit: PropsType.string,
  typeInput: PropsType.string,
  onChange: PropsType.func,
  onBlur: PropsType.func,
  parseValue: PropsType.string || PropsType.func
}

export default InputInline
