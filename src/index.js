import React from 'react'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'
import SendZkapp from './components/send-zkapp'
import AppProvider from './provider'

export const SelectWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Connect data={data} />
    </AppProvider>
  )
}

export const SendWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Send data={data} />
    </AppProvider>
  )
}

export const SignWallet = ({ children, data }) => {
  return (
    <AppProvider>
      <Sign data={data} />
    </AppProvider>
  )
}

export const SendtTransactionZkapp = ({ children, data }) => {
  return (
    <AppProvider>
      <SendZkapp data={data} />
    </AppProvider>
  )
}
