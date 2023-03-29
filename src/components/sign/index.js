/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input } from 'antd'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'

const Sign = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  const [, forceUpdate] = useState({})

  const { isInstalledWallet, connected } = useAppSelector(
    (state) => state.wallet
  )

  useEffect(() => {
    forceUpdate({})
  }, [])

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    setSendMessageResult('')
    try {
      const values = await form.validateFields()
      setLoading(true)
      if (wallet === 'Auro') {
        const result = await WALLET.Auro.methods
          .Signature(values?.signMessageContent)
          .catch((err) => err)
        if (result.signature) {
          setLoading(false)
          setSendMessageResult(JSON.stringify(result.signature))
        } else {
          setLoading(false)
          setSendMessageResult(result.message)
        }
      } else {
        try {
          const data = values?.signMessageContent
          const result = await WALLET.MetamaskFlask.methods
            .Signature(data)
            .catch((err) => {
              setSendMessageResult(JSON.stringify(err))
            })
          if (result) {
            setLoading(false)
            setSendMessageResult(JSON.stringify(result))
          } else {
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          setSendMessageResult(JSON.stringify(error))
        }
      }
    } catch (errorInfo) {}
  }

  return (
    <Card title='Sign Custom Message' type='inner'>
      <Form form={form} autoComplete='off' onFinish={sendButton} {...layout}>
        <Form.Item
          label='Message'
          name='signMessageContent'
          rules={[
            {
              required: true,
              message: 'Please input Message!'
            }
          ]}
        >
          <Input placeholder='Message' />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, offset: 0 }} shouldUpdate>
          {() => (
            <Button
              loading={loading}
              type='primary'
              htmlType='submit'
              block
              disabled={
                !form.isFieldsTouched(true) ||
                !!form.getFieldsError().filter(({ errors }) => errors.length)
                  .length
              }
            >
              Send
            </Button>
          )}
        </Form.Item>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Sign result: <span id='signMessageResult'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Sign
