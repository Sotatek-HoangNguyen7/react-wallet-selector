/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Select, Collapse } from 'antd'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'
import { getZkbody } from '../../services/zkapp'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../src/styles.css'

const { Panel } = Collapse

const SendZkapp = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
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
    const wallet = localStorage.getItem('wallet')
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    try {
      const values = await form.validateFields()
      const zkAddress = values.zkAppAddress?.trim()
      const zkBody = await getZkbody(url, zkAddress)
      setLoading(true)
      if (wallet === 'Auro') {
        const result = await WALLET.Auro.methods
          .SendTransactionZkApp({
            transaction: zkBody,
            feePayer: {
              memo: values.signPartyMemo || '',
              fee: values.signPartyFee || ''
            }
          })
          .catch((err) => err)
        if (result.hash) {
          setLoading(false)
          setSendMessageResult(result.hash)
        } else {
          setLoading(false)
          setSendMessageResult(result.message)
        }
      } else {
        // try {
        //   const url = gqlContent.value
        //   if (!url) {
        //     console.log('need Set useful gql-url')
        //     return
        //   }
        //   const zkAddress = zkAppAddress.value?.trim()
        //   const zkBody = await getZkbody(url, zkAddress)
        //   const result = await WALLET.MetamaskFlask.methods
        //     .SendTransactionZkApp(newValues)
        //     .catch((_err) => {
        //       setSendMessageResult(JSON.stringify(_err))
        //     })
        //   if (result) {
        //     setLoading(false)
        //     setSendMessageResult(JSON.stringify(result))
        //   } else {
        //     setLoading(false)
        //   }
        // } catch (error) {
        //   setLoading(false)
        //   setSendMessageResult(JSON.stringify(error))
        // }
      }
    } catch (errorInfo) {}
  }

  const handleChangeCollapse = (key) => {
    setOpen(!open)
  }

  return (
    <Card title='Send' type='inner'>
      <Form form={form} autoComplete='off' {...layout} onFinish={sendButton}>
        <Form.Item
          label='GraphQL url'
          name='gqlContent'
          rules={[
            {
              required: true,
              message: 'Please input GraphQL url!'
            }
          ]}
        >
          <Input placeholder='Address' />
        </Form.Item>
        <Form.Item
          label='ZkApp Address'
          name='zkAppAddress'
          rules={[
            {
              required: true,
              message: 'Please input ZkApp Address!'
            }
          ]}
        >
          <Input placeholder='0' />
        </Form.Item>
        <Form.Item
          label='Fee'
          name='signPartyFee'
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
        <Form.Item
          label='Memo (Optional)'
          name='signPartyMemo'
          rules={[
            {
              required: false,
              message: 'Please input Memo!'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <div className='submit-section'>
          <Form.Item
            className='bg-white'
            wrapperCol={{ span: 24, offset: 0 }}
            shouldUpdate
          >
            {() => (
              <Button
                loading={loading}
                type='primary'
                htmlType='submit'
                block
                disabled={
                  !form.getFieldValue('gqlContent') ||
                  !form.getFieldValue('zkAddress') ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
              >
                Send
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default SendZkapp
