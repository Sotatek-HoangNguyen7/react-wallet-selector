import React from 'react'
import Connect from './components/connect'
import Send from './components/send'
import Sign from './components/sign'
import AppProvider from './provider'

export const SelectWalet = ({ children }) => {
  return (
    <AppProvider>
      <Connect />
    </AppProvider>
  )
}

export const SendWalet = ({ children }) => {
  return (
    <AppProvider>
      <Send />
    </AppProvider>
  )
}

export const SignWalet = ({ children }) => {
  return (
    <AppProvider>
      <Sign />
    </AppProvider>
  )
}
