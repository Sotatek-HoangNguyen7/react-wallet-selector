/* eslint-disable no-undef */
import React, { useState } from 'react'
import { WALLET } from '../../services/multipleWallet'

const Send = () => {
  const [sendContent, setSendContent] = useState({
    sendAmountInput: '',
    receiveAddressInput: '',
    sendFee: '',
    sendMemo: ''
  })

  const [sendMessageResult, setSendMessageResult] = useState('')

  const handleChangeSendContent = (e) => {
    setSendContent({
      ...sendContent,
      [e.target.id]: e.target.value
    })
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    setSendMessageResult('')
    if (wallet === 'Auro') {
      const result = await WALLET.Auro.methods
        .SendTransaction(sendContent)
        .catch((err) => err)
      if (result.hash) {
        setSendMessageResult(result.hash)
      } else {
        setSendMessageResult(result.message)
      }
    } else {
      try {
        let newSendContent = {
          to: sendContent.receiveAddress,
          amount: sendContent.sendAmount,
          nonce: 0,
          validUntil: 0
        }
        if (endContent.sendFee) {
          newSendContent = { ...newSendContent, fee: sendContent.sendFee }
        }
        if (endContent.sendMemo) {
          newSendContent = { ...newSendContent, memo: sendContent.sendMemo }
        }
        const result = await WALLET.MetamaskFlask.methods.SendTransaction(
          newSendContent
        )
        if (result) {
          setSendMessageResult(JSON.stringify(result))
        } else {
          setSendMessageResult('reject')
        }
      } catch (error) {
        console.log(error)
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
            />
            <hr />
            <input
              className='form-control'
              type='text'
              placeholder='Set receive address'
              id='receiveAddress'
              onChange={handleChangeSendContent}
            />
            <hr />
            <input
              className='form-control'
              type='text'
              placeholder='Set Fee (Option)'
              id='sendFee'
              onChange={handleChangeSendContent}
            />
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
              Send
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
