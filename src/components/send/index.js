/* eslint-disable no-undef */
import React, { useState } from 'react'
import { WALLET } from '../../services/multipleWallet'

const Send = () => {
  const [sendContent, setSendContent] = useState({
    sendAmountInput: '',
    receiveAddressInput: '',
    sendFee: '0.0101',
    sendMemo: ''
  })
  const [loading, setLoading] = useState(false)

  const [sendMessageResult, setSendMessageResult] = useState('')

  const handleChangeSendContent = (e) => {
    setSendContent({
      ...sendContent,
      [e.target.id]: e.target.value
    })
  }

  const sendButton = async () => {
    if (!sendContent.receiveAddress || !sendContent.sendAmount) return
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    setSendMessageResult('')
    setLoading(true)
    if (wallet === 'Auro') {
      const result = await WALLET.Auro.methods
        .SendTransaction(sendContent)
        .catch((err) => err)
      if (result.hash) {
        setLoading(false)
        setSendMessageResult(result.hash)
      } else {
        setLoading(false)
        setSendMessageResult(result.message)
      }
    } else {
      try {
        let newSendContent = {
          to: sendContent.receiveAddress,
          amount: sendContent.sendAmount,
          fee: sendContent.sendFee
        }
        if (sendContent.sendMemo) {
          newSendContent = { ...newSendContent, memo: sendContent.sendMemo }
        }
        const result = await WALLET.MetamaskFlask.methods.SendTransaction(
          newSendContent
        )
        if (result) {
          setLoading(false)
          setSendMessageResult(JSON.stringify(result))
        } else {
          setLoading(false)
          setSendMessageResult('reject')
        }
      } catch (error) {
        setLoading(false)
        setSendMessageResult('error')
      }
    }
  }

  return (
    <div>
      <div className='card full-width'>
        <div className='card-body'>
          <h4 className='card-title'>Send</h4>
          <hr />
          <div id='encrypt-message-form'>
            <input
              className='form-control'
              type='text'
              placeholder='Set send amount'
              id='sendAmount'
              onChange={handleChangeSendContent}
              required
            />
            <hr />
            <input
              className='form-control'
              type='text'
              placeholder='Set receive address'
              id='receiveAddress'
              onChange={handleChangeSendContent}
              required
            />
            <hr />
            <select
              className='form-select form-select-md mb-3 w-150 d-flex justify-content-center'
              aria-label='.form-select-lg example'
              onChange={handleChangeSendContent}
              value={sendContent.sendFee}
              id='sendFee'
            >
              <option value='0.0011'>Slow</option>
              <option value='0.0101'>Default</option>
              <option value='0.201'>Fast</option>
            </select>
            <hr />
            <input
              className='form-control'
              type='text'
              placeholder='Set memo (Option)'
              id='sendMemo'
              onChange={handleChangeSendContent}
            />
            <hr />
            <button
              onClick={sendButton}
              className='btn btn-primary btn-md d-flex justify-content-center'
              id='sendButton'
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
              <span className={`${loading ? 'ms-2' : ''} m-auto`}>Send</span>
            </button>
          </div>
          <hr />
          <p className='info-text alert alert-secondary'>
            Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Send
