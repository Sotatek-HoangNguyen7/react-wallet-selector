/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector, useAppDispatch } from '../../hooks/redux'
import { formatBalance, formatAddress } from '../../utils/utils'
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
    const nw = await WALLET.MetamaskFlask.methods.RequestNetwork()
    setValue(nw)
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
      } finally {
        firstTimeRun.current = true
      }
    }
  }

  const handleConnect = async () => {
    checkInstallWhenCallAction()
    setLoading(true)
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
    try {
      if (!wallet) return
      if (wallet === 'Auro') {
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
      }
      if (wallet === 'MetamaskFlask') {
        await WALLET.MetamaskFlask.methods.connectToSnap()
        const isInstalledSnap = await WALLET.MetamaskFlask.methods.getSnap()
        await WALLET.MetamaskFlask.methods.SwitchNetwork(value)
        setNetWork(value)
        const accountList = await WALLET.MetamaskFlask.methods.AccountList()
        const accountInfor =
          await WALLET.MetamaskFlask.methods.getAccountInfors()
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
            balance: ethers.utils.formatUnits(
              accountInfor.balance.total,
              'gwei'
            ),
            accountName: accountInfor.name,
            inferredNonce: accountInfor.inferredNonce
          })
        )
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeWallet = (e) => {
    checkInstallWhenCallAction()
    const val = e.target.value || 'MetamaskFlask'
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
  }

  const handleChageNetWork = async (e) => {
    setLoading(true)
    setValue(e.target.value)
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
        .SwitchNetwork(e.target.value)
        .then(async () => {
          dispatch(setNetWork(e.target.value))
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
      <div className='d-flex'>
        <select
          className='form-select form-select-md mb-3 w-300 d-flex justify-content-center'
          aria-label='.form-select-lg example'
          defaultValue={localStorage.getItem('wallet') || 'MetamaskFlask'}
          onChange={handleChangeWallet}
        >
          <option value='MetamaskFlask'>Metamask Flask</option>
          <option value='Auro'>Auro</option>
        </select>
        <select
          disabled={localStorage.getItem('wallet') === 'Auro'}
          className='form-select form-select-md mb-3 ms-3 w-150 d-flex justify-content-center'
          aria-label='.form-select-lg example'
          value={network}
          onChange={handleChageNetWork}
        >
          <option value='Mainnet'>Mainnet</option>
          <option value='Devnet'>Devnet</option>
          <option value='Berkeley'>Berkeley</option>
        </select>
      </div>
      {!isInstalledWallet ? (
        <button
          type='button'
          className='btn btn-warning btn-md'
          onClick={() => openLinkInstallFlask()}
        >
          {localStorage.getItem('wallet') === 'Auro'
            ? 'Please install Auro Wallet Click here!'
            : 'Metamask Flask is required to run snap!'}
        </button>
      ) : (
        <button
          disabled={disableConectButton}
          type='button'
          className='btn btn-primary btn-md d-flex justify-content-center'
          onClick={handleConnect}
        >
          {loading ? (
            <div style={{ position: 'relative' }}>
              <div className='loader'>
                <div className='inner one' />
                <div className='inner two' />
                <div className='inner three' />
              </div>
            </div>
          ) : null}
          <span className={`${loading ? 'ms-2' : ''} m-auto`}>
            Connect wallet
          </span>
        </button>
      )}
      <hr />
      <div className='mt-1 mb-2'>
        <b>Accounts:</b> {formatAddress(activeAccount)}
      </div>
      <div className='mt-1 mb-2'>
        <b>Balance:</b>{' '}
        <span className='text-danger'>{formatBalance(balance)}</span> Mina
      </div>
      {localStorage.getItem('wallet') === 'Auro' ? null : (
        <div>
          <div className='mt-1 mb-2'>
            <b>Transactions:</b> <br />
            {transactions.map((el) => {
              return (
                <div key={el.id}>
                  <div>
                    Amount: <span className='text-info'>{el.amount}</span>
                  </div>
                  <div>
                    DateTime:{' '}
                    <span className='text-info'>
                      {moment(el.dateTime).format('DD/MM/YYYY HH:mm')}
                    </span>
                  </div>
                  <div>
                    Fee: <span className='text-info'>{el.fee}</span>
                  </div>
                  <div>
                    FeeToken: <span className='text-info'>{el.feeToken}</span>
                  </div>
                  <div>
                    From:{' '}
                    <span className='text-info'>{formatAddress(el.from)}</span>
                  </div>
                  <div>
                    To:{' '}
                    <span className='text-info'>{formatAddress(el.to)}</span>
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
                  <hr />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Connect
