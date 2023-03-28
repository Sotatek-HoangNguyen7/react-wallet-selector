/* eslint-disable no-undef */
import React, { useState } from 'react'
import { WALLET } from '../../services/multipleWallet'

const Sign = () => {
  const [signMessageContent, setSignMessageContent] = useState('')
  const [signMessageResult, setSignMessageResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangeSignMessageContent = (e) => {
    setSignMessageContent(e.target.value)
  }

  const signMessageButton = async () => {
    if (!signMessageContent) return
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    setSignMessageResult('')
    setLoading(true)
    if (wallet === 'Auro') {
      const signResult = await WALLET.Auro.methods
        .Signature(signMessageContent)
        .catch((err) => err)
      if (signResult.signature) {
        setLoading(false)
        setSignMessageResult(JSON.stringify(signResult.signature))
      } else {
        setLoading(false)
        setSignMessageResult(signResult.message)
      }
    } else {
      try {
        const signResult = await WALLET.MetamaskFlask.methods.Signature(
          signMessageContent
        )
        if (signResult) {
          setLoading(false)
          setSignMessageResult(JSON.stringify(signResult))
        } else {
          setLoading(false)
          setSignMessageResult('reject')
        }
      } catch (error) {
        setLoading(false)
        setSignMessageResult('error')
      }
    }
  }

  return (
    <div>
      <div className='card full-width'>
        <div className='card-body'>
          <h4 className='card-title'>Sign</h4>
          <hr />
          <div id='encrypt-message-form'>
            <input
              className='form-control'
              type='text'
              placeholder='Set sign content'
              id='signMessageContent'
              onChange={handleChangeSignMessageContent}
              required
            />
            <hr />
            <button
              onClick={signMessageButton}
              className='btn btn-primary btn-md d-flex justify-content-center'
              id='signMessageButton'
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
              <span className={`${loading ? 'ms-2' : ''} m-auto`}>Sign</span>
            </button>
          </div>
          <hr />
          <p className='info-text alert alert-secondary'>
            Sign result: <span id='signMessageResult'>{signMessageResult}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sign
