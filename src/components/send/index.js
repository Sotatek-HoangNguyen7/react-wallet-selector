/* eslint-disable no-undef */
import React, { useState } from 'react'
import { Form, Button, Card, Input, Select } from 'antd'
import { WALLET } from '../../services/multipleWallet'

const Send = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet') || 'MetamaskFlask'
    setSendMessageResult('')
    try {
      const values = await form.validateFields()
      setLoading(true)
      if (wallet === 'Auro') {
        const result = await WALLET.Auro.methods
          .SendTransaction(values)
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
          let newValues = {
            to: values.receiveAddress,
            amount: values.sendAmount,
            fee: values.sendFee
          }
          if (values.sendMemo) {
            newValues = { ...newSendContent, memo: values.sendMemo }
          }
          const result = await WALLET.MetamaskFlask.methods.SendTransaction(
            newValues
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
    } catch (errorInfo) {}
  }

  return (
    <Card title='Send' type='inner'>
      <Form form={form} autoComplete='off' {...layout}>
        <Form.Item
          label='Send amount'
          name='sendAmount'
          rules={[
            {
              required: true,
              message: 'Please input Send amount!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Receive address'
          name='receiveAddress'
          rules={[
            {
              required: true,
              message: 'Please input Receive address!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Fee'
          name='sendFee'
          rules={[
            {
              required: true,
              message: 'Please select Fee!'
            }
          ]}
          initialValue='0.0101'
        >
          <Select>
            <Select.Option value='0.0011'>Slow</Select.Option>
            <Select.Option value='0.0101'>Default</Select.Option>
            <Select.Option value='0.201'>Fast</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label='Memo'
          name='sendMemo'
          rules={[
            {
              required: false,
              message: 'Please input Memo!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Nonce'
          name='sendNonce'
          rules={[
            {
              required: false,
              message: 'Please input Nonce!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
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
      <p className='info-text alert alert-secondary mt-3'>
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Send
