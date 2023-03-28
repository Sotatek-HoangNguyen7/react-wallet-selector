/* eslint-disable no-undef */
import React, { useState } from 'react'
import { Form, Button, Card, Input } from 'antd'
import { WALLET } from '../../services/multipleWallet'

const Sign = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')

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
          const result = await WALLET.MetamaskFlask.methods.Signature(
            values?.signMessageContent
          )
          console.log(result)
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
    } catch (errorInfo) {}
  }

  return (
    <Card title='Send' type='inner'>
      <Form form={form} autoComplete='off' {...layout}>
        <Form.Item
          label='Sign content'
          name='signMessageContent'
          rules={[
            {
              required: true,
              message: 'Please input Sign content!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Button
            onClick={sendButton}
            loading={loading}
            type='primary'
            htmlType='submit'
          >
            Send
          </Button>
        </Form.Item>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Sign result: <span id='signMessageResult'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Sign
