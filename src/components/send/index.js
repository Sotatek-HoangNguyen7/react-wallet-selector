/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Collapse, Radio } from 'antd'
import { blockInvalidChar } from '../../utils/utils'
import { CaretUpOutlined } from '@ant-design/icons'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'

const { Panel } = Collapse

const Send = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  const [placeholder, setPlaceholder] = useState('0.0101')
  const [, forceUpdate] = useState({})

  const { isInstalledWallet, connected, balance } = useAppSelector(
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
            newValues = { ...newValues, memo: values.sendMemo }
          }
          if (values.sendFee2) {
            newValues = { ...newValues, fee: values.sendFee2 }
          }
          const result = await WALLET.MetamaskFlask.methods
            .SendTransaction(newValues)
            .catch((_err) => {
              setSendMessageResult(JSON.stringify(_err))
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

  const handleChangeCollapse = () => {
    setOpen(!open)
  }

  const handleClickMax = () => {
    form.setFieldValue('sendAmount', balance)
  }

  const handleOnChangeBalance = (event) => {}

  const handleChangeFee = ({ target: { value } }) => {
    setPlaceholder(value)
  }

  const handleChangeFeeInput = (value) => {
    if (value === '0.0011' || value === '0.0101' || value === '0.201')
      form.setFieldValue('sendFee', value)
  }

  const options = [
    { label: 'Slow', value: '0.0011' },
    { label: 'Default', value: '0.0101' },
    { label: 'Fast', value: '0.201' }
  ]

  return (
    <Card title='Send' type='inner'>
      <Form
        form={form}
        autoComplete='off'
        {...layout}
        onFinish={sendButton}
        hideRequiredMark
      >
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
          <Input
            placeholder='0'
            onKeyDown={blockInvalidChar}
            pattern='^\$\d{1,3}(,\d{3})*(\.\d+)?$'
            suffix={<span onClick={handleClickMax}>Max</span>}
          />
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
          <Radio.Group
            options={options}
            onChange={handleChangeFee}
            optionType='button'
          />
        </Form.Item>
        <hr className='m-0' />
        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <CaretUpOutlined rotate={isActive ? 0 : 180} />
          )}
          expandIconPosition='end'
          onChange={handleChangeCollapse}
        >
          <Panel header='Advanced' key='1' />
        </Collapse>
        <div style={{ height: open ? 'auto' : 0, position: 'relative' }}>
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
            <Input
              placeholder={placeholder}
              onKeyDown={blockInvalidChar}
              onChange={handleChangeFeeInput}
            />
          </Form.Item>
        </div>
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
        </div>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default Send
