/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Input, Collapse, Col, Row, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
// import InputPrice from '../input'
// import { blockInvalidChar } from '../../utils/utils'
import { WALLET } from '../../services/multipleWallet'
import { useAppSelector } from '../../hooks/redux'
import { getZkbody, getzkState } from '../../services/zkapp'
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../../src/styles.css'
import { prop } from 'snarkyjs'

const { Panel } = Collapse

const SendZkapp = (props) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [sendMessageResult, setSendMessageResult] = useState('')
  // const [warning, setWarning] = useState('')
  const [placeholder, setPlaceholder] = useState('0.0101')
  const [, forceUpdate] = useState({})
  const [loadingGetStateZkap, setLoadingGetStateZkap] = useState(false)
  const { zkAppAddress } = props

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

  const getStateZkapp = async () => {
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    setLoadingGetStateZkap(true)
    const zkState = await getzkState(zkAppAddress)
    setLoadingGetStateZkap(false)
    setSendMessageResult(zkState)
  }

  const sendButton = async () => {
    const wallet = localStorage.getItem('wallet')
    if (!connected) return setSendMessageResult('Please connect wallet!')
    setSendMessageResult('')
    try {
      setLoading(true)
      const values = await form.validateFields()
      const answer = values.answer?.trim()
      const fee = 0.01
      // const fee = values.sendFee2 ? values.sendFee2 : values.sendFee
      const zkBody = await getZkbody(answer, zkAppAddress)
      if (zkBody?.error) {
        setLoading(false)
        setSendMessageResult(JSON.stringify(zkBody))
      } else {
        if (wallet === 'Auro') {
          try {
            const result = await WALLET.Auro.methods.SendTransactionZkApp({
              transaction: zkBody.partiesJsonUpdate,
              feePayer: {
                memo: '',
                fee: fee
              }
            })
            if (result) {
              setLoading(false)
              setSendMessageResult(JSON.stringify(result))
            }
          } catch (error) {
            setLoading(false)
            console.log(error)
            setSendMessageResult(JSON.stringify(error))
          }
        } else {
          try {
            const result =
              await WALLET.MetamaskFlask.methods.SendTransactionZkApp({
                transaction: zkBody.partiesJsonUpdate,
                feePayer: {
                  memo: '',
                  fee: fee
                }
              })
            if (result) {
              setLoading(false)
              setSendMessageResult(JSON.stringify(result))
            }
          } catch (error) {
            setLoading(false)
            console.log(error)
            setSendMessageResult(JSON.stringify(error))
          }
        }
      }
    } catch (errorInfo) {}
  }

  const handleChangeCollapse = () => {
    setOpen(!open)
  }

  const handleChangeFee = ({ target: { value } }) => {
    setPlaceholder(value)
  }

  const handleChangeFeeInput = (value) => {
    if (value === '0.0011' || value === '0.0101' || value === '0.201') {
      form.setFieldValue('sendFee', value)
    } else {
      form.setFieldValue('sendFee', '')
    }
  }

  const options = [
    { label: 'Slow', value: '0.0011' },
    { label: 'Default', value: '0.0101' },
    { label: 'Fast', value: '0.201' }
  ]

  return (
    <Card title='Send zkApp transaction' type='inner'>
      <Form
        form={form}
        autoComplete='off'
        {...layout}
        onFinish={sendButton}
        hideRequiredMark
        labelWrap
      >
        <Form.Item
          label='Can you input correct state?'
          name='answer'
          rules={[
            {
              required: true,
              message: 'Please input Parameter!'
            }
          ]}
        >
          <Input
            placeholder='Parameter'
            suffix={
              <Tooltip
                overlayStyle={{ width: 290 }}
                title={
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600 }}>
                      Correct state calculation formula
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Correct state = the square of the Current state
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      e.g.
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Current state (checked) = 3;
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontStyle: 'italic',
                        fontWeight: 400
                      }}
                    >
                      Correct state = 3*3 = 9
                    </div>
                  </div>
                }
                color='#727272'
              >
                <InfoCircleOutlined />
              </Tooltip>
            }
          />
        </Form.Item>
        {/* <Form.Item
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
            help={
              warning ? (
                <span style={{ color: '#faad14' }}>
                  Fees are much higher than average
                </span>
              ) : null
            }
            rules={[
              () => ({
                validator(_, value) {
                  setWarning(false)
                  if (!value) {
                    return Promise.resolve()
                  }
                  if (Number(value) < 0.0011) {
                    return Promise.reject(
                      new Error(
                        `Invalid user command. Fee ${value} is less than the minimum fee of 0.0101`
                      )
                    )
                  }
                  if (Number(value) > 10) {
                    setWarning(true)
                    return Promise.resolve()
                  }
                  return Promise.resolve()
                }
              })
            ]}
          >
            <InputPrice
              placeholder={placeholder}
              onKeyDown={blockInvalidChar}
              onChange={handleChangeFeeInput}
            />
          </Form.Item>
        </div> */}
        <div className='submit-section'>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                className='bg-white'
                shouldUpdate
                wrapperCol={{ span: 24, offset: 0 }}
              >
                {() => (
                  <Button
                    loading={loading}
                    type='primary'
                    htmlType='submit'
                    disabled={
                      !form.getFieldValue('answer') ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                    block
                  >
                    Send
                  </Button>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                className='bg-white'
                wrapperCol={{ span: 24, offset: 0 }}
              >
                <Button
                  loading={loadingGetStateZkap}
                  type='primary'
                  onClick={getStateZkapp}
                  block
                >
                  Check current state
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
      <p className='info-text alert alert-secondary mt-3 text-break'>
        Send Result: <span id='sendResultDisplay'>{sendMessageResult}</span>
      </p>
    </Card>
  )
}

export default SendZkapp
