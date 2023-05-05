import React from 'react'
import PropTypes from 'prop-types'
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

export const SendTransactionZkapp = ({
  children,
  data,
  zkAppAddress,
  checkConnect = () => false
}) => {
  return (
    <AppProvider>
      <SendZkapp
        data={data}
        zkAppAddress={zkAppAddress}
        checkConnect={checkConnect}
      />
    </AppProvider>
  )
}

SelectWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SendWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SignWallet.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func
}

SendTransactionZkapp.propTypes = {
  children: PropTypes.node,
  data: PropTypes.func,
  zkAppAddress: PropTypes.string,
  checkConnect: PropTypes.func
}
