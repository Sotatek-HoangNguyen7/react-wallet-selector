/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import { Avatar, Segmented, Space, Button, Card, Typography } from 'antd'
import moment from 'moment'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import {
  formatBalance,
  formatAddress,
  handelCoppy,
  dateFomat
} from '../../utils/utils'
import {
  connectWallet,
  setActiveAccount,
  setTransactions,
  setNetWork,
  setWalletInstalled
} from '../../slices/walletSlice'
import { useHasWalet } from '../../hooks/useHasWalet'
import detectEthereumProvider from '@metamask/detect-provider'

const ethers = require('ethers')

function Connect() {
  const dispatch = useAppDispatch()
  const { isInstalledWallet, activeAccount, balance, transactions, network } =
    useAppSelector((state) => state.wallet)
  const [value, setValue] = useState(network)
  const [loading, setLoading] = useState(false)
  const [disableConectButton, setDisableConectButton] = useState(false)

  useEffect(() => {
    localStorage.setItem(
      'wallet',
      localStorage.getItem('wallet') || 'MetamaskFlask'
    )
  }, [])

  useHasWalet()

  useEffect(() => {
    dispatch(setNetWork(value))
  }, [value])

  const requestNetWork = async () => {
    const { name } = await WALLET.MetamaskFlask.methods.GetNetworkConfigSnap()
    console.log('chainChanged', name)
    setValue(name)
  }

  useEffect(() => {
    if (localStorage.getItem('wallet') === 'Auro') {
      window.mina?.on('chainChanged', async (network) => {
        const result = await WALLET.Auro.methods.connectToAuro()
        setValue(network)
        const isInstalled = window.mina
        if (result.message) {
          setLoading(false)
        } else {
          setLoading(false)
          const accountList = await WALLET.Auro.methods.AccountList()
          let urlProxy = 'https://proxy.minaexplorer.com/'
          if (network === 'Mainnet')
            urlProxy = 'https://proxy.minaexplorer.com/'
          if (network === 'Devnet')
            urlProxy = 'https://proxy.devnet.minaexplorer.com/'
          if (network === 'Berkeley')
            urlProxy = 'https://proxy.berkeley.minaexplorer.com/'
          const { account: accountInfor } =
            await WALLET.Auro.methods.getAccountInfors(
              result.toString(),
              urlProxy
            )
          // const txList = await await WALLET.Auro.methods.getTxHistory(urlProxy, result.toString());
          dispatch(setTransactions([]))
          dispatch(
            connectWallet({
              accountList,
              isInstalled
            })
          )
          dispatch(
            setActiveAccount({
              activeAccount: accountInfor.publicKey,
              balance: ethers.utils.formatUnits(
                accountInfor.balance.total,
                'gwei'
              ),
              accountName: accountInfor.name,
              inferredNonce: accountInfor.inferredNonce
            })
          )
        }
      })
    } else {
      requestNetWork()
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('wallet') === 'Auro') {
      window.mina?.on('accountsChanged', async (accounts) => {
        const isInstalled = window.mina
        setLoading(false)
        const accountList = await WALLET.Auro.methods.AccountList()
        let urlProxy = 'https://proxy.minaexplorer.com/'
        if (network === 'Mainnet') urlProxy = 'https://proxy.minaexplorer.com/'
        if (network === 'Devnet')
          urlProxy = 'https://proxy.devnet.minaexplorer.com/'
        if (network === 'Berkeley')
          urlProxy = 'https://proxy.berkeley.minaexplorer.com/'
        const { account: accountInfor } =
          await WALLET.Auro.methods.getAccountInfors(
            accounts.toString(),
            urlProxy
          )
        // const txList = await await WALLET.Auro.methods.getTxHistory(urlProxy, result.toString());
        dispatch(setTransactions([]))
        dispatch(
          connectWallet({
            accountList,
            isInstalled
          })
        )
        dispatch(
          setActiveAccount({
            activeAccount: accountInfor.publicKey,
            balance: ethers.utils.formatUnits(
              accountInfor.balance.total,
              'gwei'
            ),
            accountName: accountInfor.name,
            inferredNonce: accountInfor.inferredNonce
          })
        )
      })
    } else {
      window.ethereum.on('accountsChanged', async (accounts) => {
        console.log(accounts)
      })
    }
  }, [])

  const checkInstallWhenCallAction = async () => {
    if (localStorage.getItem('wallet') === 'Auro') {
      if (window.mina) dispatch(setWalletInstalled(true))
      if (!window.mina) dispatch(setWalletInstalled(false))
    } else {
      try {
        const provider = await detectEthereumProvider({
          mustBeMetaMask: false,
          silent: true,
          timeout: 3000
        })
        const isFlask = (
          await provider?.request({ method: 'web3_clientVersion' })
        )?.includes('flask')
        if (provider && isFlask) {
          dispatch(setWalletInstalled(true))
        } else dispatch(setWalletInstalled(false))
      } catch (e) {
        dispatch(setWalletInstalled(false))
      }
    }
  }

  const connectToAuro = async () => {
    const result = await WALLET.Auro.methods.connectToAuro()
    const network = await window.mina.requestNetwork().catch((err) => err)
    setValue(network)
    const isInstalled = window.mina
    if (result.message) {
      setLoading(false)
    } else {
      setLoading(false)
      const accountList = await WALLET.Auro.methods.AccountList()
      let urlProxy = 'https://proxy.minaexplorer.com/'
      if (network === 'Mainnet') urlProxy = 'https://proxy.minaexplorer.com/'
      if (network === 'Devnet')
        urlProxy = 'https://proxy.devnet.minaexplorer.com/'
      if (network === 'Berkeley')
        urlProxy = 'https://proxy.berkeley.minaexplorer.com/'
      const { account: accountInfor } =
        await WALLET.Auro.methods.getAccountInfors(result.toString(), urlProxy)
      // const txList = await await WALLET.Auro.methods.getTxHistory(urlProxy, result.toString());
      dispatch(setTransactions([]))
      dispatch(
        connectWallet({
          accountList,
          isInstalled
        })
      )
      dispatch(
        setActiveAccount({
          activeAccount: accountInfor.publicKey,
          balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei'),
          accountName: accountInfor.name,
          inferredNonce: accountInfor.inferredNonce
        })
      )
    }
  }

  const connectToMetaMaskFlask = async () => {
    await WALLET.MetamaskFlask.methods.connectToSnap()
    const isInstalledSnap = await WALLET.MetamaskFlask.methods.getSnap()
    await WALLET.MetamaskFlask.methods.SwitchNetwork(value)
    setNetWork(value)
    const accountList = await WALLET.MetamaskFlask.methods.AccountList()
    const accountInfor = await WALLET.MetamaskFlask.methods.getAccountInfors()
    const txList = await await WALLET.MetamaskFlask.methods.getTxHistory()
    dispatch(setTransactions(txList))
    dispatch(
      connectWallet({
        accountList,
        isInstalledSnap
      })
    )
    dispatch(
      setActiveAccount({
        activeAccount: accountInfor.publicKey,
        balance: ethers.utils.formatUnits(accountInfor.balance.total, 'gwei'),
        accountName: accountInfor.name,
        inferredNonce: accountInfor.inferredNonce
      })
    )
    setLoading(false)
  }

  const handleConnect = async () => {
    setLoading(true)
    checkInstallWhenCallAction()
    dispatch(setTransactions([]))
    dispatch(
      setActiveAccount({
        activeAccount: '',
        balance: '',
        accountName: '',
        inferredNonce: ''
      })
    )
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    if (!wallet) return
    if (wallet === 'Auro') {
      connectToAuro()
    } else {
      connectToMetaMaskFlask()
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleConnect()
    }, 200)
  }, [])

  const handleChangeWallet = (str) => {
    const val = str || 'MetamaskFlask'
    setLoading(false)
    localStorage.setItem('wallet', val)
    dispatch(setTransactions([]))
    dispatch(
      setActiveAccount({
        activeAccount: '',
        balance: '',
        accountName: '',
        inferredNonce: ''
      })
    )
    setTimeout(() => {
      checkInstallWhenCallAction()
    })
  }

  const handleChageNetWork = async (str) => {
    setLoading(true)
    setValue(str)
    dispatch(setTransactions([]))
    dispatch(
      setActiveAccount({
        activeAccount: '',
        balance: '',
        accountName: '',
        inferredNonce: ''
      })
    )

    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'

    if (!wallet) return

    if (wallet === 'MetamaskFlask') {
      await WALLET.MetamaskFlask.methods
        .SwitchNetwork(str)
        .then(async () => {
          dispatch(setNetWork(str))
          const accountList = await WALLET.MetamaskFlask.methods.AccountList()
          const accountInfor =
            await WALLET.MetamaskFlask.methods.getAccountInfors()
          const txList = await WALLET.MetamaskFlask.methods.getTxHistory()
          await dispatch(setTransactions(txList))
          dispatch(
            connectWallet({
              accountList
            })
          )
          await dispatch(
            setActiveAccount({
              activeAccount: accountInfor.publicKey,
              balance: ethers.utils.formatUnits(
                accountInfor.balance.total,
                'gwei'
              ),
              accountName: accountInfor.name,
              inferredNonce: accountInfor.inferredNonce
            })
          )
          setLoading(false)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    if (wallet === 'Auro') {
      // NOT SUPPORT
    }
  }

  const openLinkInstallFlask = () => {
    const wallet = localStorage.getItem('wallet')
    const auroLink =
      'https://chrome.google.com/webstore/detail/auro-wallet/cnmamaachppnkjgnildpdmkaakejnhae'
    const MetamaskFlaskLink =
      'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk'
    if (wallet === 'Auro') {
      window.open(auroLink, '_blank')?.focus()
    } else {
      window.open(MetamaskFlaskLink, '_blank')?.focus()
    }
  }

  // export const OPTIONS_NETWORK = ['Mainnet', 'Devnet', 'Berkeley'];

  const renderHashLink = () => {
    if (network === 'Mainnet') return 'https://minaexplorer.com/transaction/'
    if (network === 'Devnet')
      return 'https://devnet.minaexplorer.com/transaction/'
    if (network === 'Berkeley')
      return 'https://berkeley.minaexplorer.com/transaction/'
  }

  return (
    <div>
      <Space direction='vertical'>
        <Segmented
          defaultValue={localStorage.getItem('wallet') || 'MetamaskFlask'}
          onChange={handleChangeWallet}
          options={[
            {
              label: (
                <div style={{ padding: 4 }}>
                  <Avatar
                    shape='square'
                    size={80}
                    src='https://addons.mozilla.org/user-media/addon_icons/2729/2729495-64.png?modified=88e149c3'
                  />
                </div>
              ),
              value: 'MetamaskFlask'
            },
            {
              label: (
                <div style={{ padding: 4 }}>
                  <Avatar
                    shape='square'
                    size={100}
                    src='https://www.aurowallet.com/wp-content/uploads/2022/10/icon-new.svg'
                  />
                </div>
              ),
              value: 'Auro'
            }
          ]}
        />
        <Segmented
          disabled={localStorage.getItem('wallet') === 'Auro'}
          value={value}
          onChange={handleChageNetWork}
          options={['Mainnet', 'Devnet', 'Berkeley']}
        />
        {!isInstalledWallet ? (
          <Button onClick={() => openLinkInstallFlask()}>
            {localStorage.getItem('wallet') === 'Auro'
              ? 'Please install Auro Wallet Click here!'
              : 'Metamask Flask is required to run snap!'}
          </Button>
        ) : (
          <Button
            disabled={disableConectButton || loading}
            onClick={handleConnect}
            loading={loading}
            type='primary'
          >
            Connect wallet
          </Button>
        )}
      </Space>
      <hr />
      <Typography.Title level={3}>
        Accounts: {formatAddress(activeAccount)}
      </Typography.Title>
      <Typography.Title level={3}>
        Balance: <span className='text-danger'>{formatBalance(balance)}</span>{' '}
        Mina
      </Typography.Title>
      {localStorage.getItem('wallet') === 'Auro' ? null : (
        <div>
          <div className='mt-1 mb-2'>
            <Typography.Title level={3}>Transactions:</Typography.Title>
            {transactions.map((el, index) => {
              return (
                <Space
                  key={index}
                  direction='vertical'
                  size='middle'
                  style={{ display: 'flex' }}
                >
                  <Card size='small'>
                    <div>
                      Amount:{' '}
                      <span
                        className={`${
                          el.from === activeAccount
                            ? 'text-danger'
                            : 'text-success'
                        }`}
                      >
                        {(el.from === activeAccount ? `- ` : `+ `) +
                          formatBalance(
                            ethers.utils.formatUnits(el?.amount, 'gwei')
                          )}
                      </span>
                    </div>
                    <div>
                      DateTime:{' '}
                      <span className='text-info'>
                        {moment(el.dateTime).format(dateFomat)}
                      </span>
                    </div>
                    <div>
                      Fee:{' '}
                      <span className='text-info'>
                        {formatBalance(
                          ethers.utils.formatUnits(el?.fee || 0, 'gwei')
                        )}
                      </span>
                    </div>
                    <div>
                      FeeToken: <span className='text-info'>{el.feeToken}</span>
                    </div>
                    <div>
                      From:{' '}
                      <span
                        className='text-info cursor-pointer'
                        onClick={() =>
                          handelCoppy(el.from, `${el.from}${index}`)
                        }
                      >
                        {formatAddress(el.from)}
                      </span>
                    </div>
                    <div>
                      To:{' '}
                      <span
                        className='text-info cursor-pointer'
                        onClick={() => handelCoppy(el.from, `${el.to}${index}`)}
                      >
                        {formatAddress(el.to)}
                      </span>
                    </div>
                    <div>
                      Hash:{' '}
                      <a
                        href={renderHashLink() + el?.hash}
                        target='_blank'
                        className='text-info'
                        rel='noreferrer'
                      >
                        {el.hash}
                      </a>
                    </div>
                    <div>
                      Memo: <span className='text-info'>{el.memo}</span>
                    </div>
                    <div>
                      Nonce: <span className='text-info'>{el.nonce}</span>
                    </div>
                    <div>
                      Status: <span className='text-info'>{el.status}</span>
                    </div>
                  </Card>
                </Space>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Connect
