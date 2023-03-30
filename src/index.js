import React from 'react'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'
import SendZkapp from './components/send-zkapp'
import AppProvider from './provider'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './styles.module.css'

export const SelectWalet = ({ children, data }) => {
  return (
    <AppProvider>
      <Connect data={data} />
    </AppProvider>
  )
}

export const SendWalet = ({ children, data }) => {
  return (
    <AppProvider>
      <Send data={data} />
    </AppProvider>
  )
}

export const SignWalet = ({ children, data }) => {
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
