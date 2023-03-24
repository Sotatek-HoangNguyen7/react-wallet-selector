import React from 'react'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'
import MinaProvider from './provider'

export const SelectWalet = ({ children }) => {
  return <Connect />
}

export const SendWalet = ({ children }) => {
  return <Send />
}

export const SignWalet = ({ children }) => {
  return <Sign />
}

export const MinaWalletProvider = ({ children }) => {
  return <MinaProvider>{children}</MinaProvider>
}
