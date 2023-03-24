import React from 'react'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'

export const SelectWalet = ({ text }) => {
  return <Connect />
}

export const SendWalet = ({ text }) => {
  return <Send />
}

export const SignWalet = ({ text }) => {
  return <Sign />
}


export const MinaWalletProvider = () => {
  return <Sign />
}
