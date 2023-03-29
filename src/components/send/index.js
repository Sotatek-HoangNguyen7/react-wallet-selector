/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Select, Collapse } from 'antd'
import { CaretUpOutlined } from '@ant-design/icons'
import { WALLET } from '../../services/multipleWallet'

const { Panel } = Collapse

const Send = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  const [, forceUpdate] = useState({})

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
          if (values.sendFee2) {
            newValues = { ...newSendContent, fee: values.sendFee2 }
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
          setSendMessageResult(error)
        }
      }
    } catch (errorInfo) {}
  }

  return (
    <Card title='Send' type='inner'>
      <Form form={form} autoComplete='off' {...layout} onFinish={sendButton}>
        <Form.Item
          label='To'
          name='receiveAddress'
          rules={[
            {
              required: true,
              message: 'Please input Address!'
            }
          ]}
        >
          <Input placeholder='Address' />
        </Form.Item>
        <Form.Item
          label='Amount'
          name='sendAmount'
          rules={[
            {
              required: true,
              message: 'Please input Amount!'
            }
          ]}
        >
          <Input placeholder='0' />
        </Form.Item>
        <Form.Item
          label='Memo (Optional)'
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
          label='Fee'
          name='sendFee'
          rules={[
            {
              required: false,
              message: 'Please select Fee!'
            }
          ]}
          initialValue='0.0101'
        >
          <Select>
            <Select.Option value='0.0011'>Slow(0.0011)</Select.Option>
            <Select.Option value='0.0101'>Default(0.0101)</Select.Option>
            <Select.Option value='0.201'>Fast(0.201)</Select.Option>
          </Select>
        </Form.Item>
        <hr className='m-0' />

        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <CaretUpOutlined rotate={isActive ? 0 : 180} />
          )}
          expandIconPosition='end'
        >
          <Panel header='Advanced' key='1'>
            <Form.Item
              label='Transaction Fee'
              name='sendFee2'
              rules={[
                {
                  required: false,
                  message: 'Please input Nonce!'
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
          </Panel>
        </Collapse>
        <Form.Item wrapperCol={{ span: 24, offset: 0 }} shouldUpdate>
          {() => (
            <Button
              loading={loading}
              type='primary'
              htmlType='submit'
              block
              disabled={
                !form.getFieldValue('receiveAddress') ||
                !form.getFieldValue('sendAmount') ||
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
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Send
