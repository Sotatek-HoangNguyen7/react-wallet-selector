/* eslint-disable no-sequences */
/* eslint-disable no-void */
/* eslint-disable no-unused-vars */
import {
  PublicKey,
  Mina,
  fetchAccount,
  isReady,
  Field,
  setGraphqlEndpoint
} from 'snarkyjs'

import { Quiz } from './contract/Quiz'

let timingStack = []
let i = 0

function tic(label = `Run command ${i++}`) {
  console.log(`${label}... `)
  timingStack.push([label, Date.now()])
}

function toc() {
  let [label, start] = timingStack.pop()
  let time = (Date.now() - start) / 1000
  console.log(`\r${label}... ${time.toFixed(3)} sec\n`)
}

const senderPrivateKey = 'EKEZvpJoapJyR8DH9zG1PTsrsdF56jdFS5yKLeoJUzagapGtX42t'
const senderAddress = 'B62qqQXYTh8zAoSNS9Nf5mBkA2MxdC7WpbzMd6S1cwtNPzzwD582eDr'

const zkAppPrivateKey =
  'B62qm3p1ZGw3xiWu4x6bfrF2FS4kj2bp1qrHkdM9rr9WscP3g6qNcb6'
// This should be removed once the zkAppAddress is updated.
const zkAppAddress = 'B62qmJhEbCcdCUp2X4fpUYgh6mn3oJtdCcaCA6ghBtJLgJ4JbZKBDti'

// const url = `https://berkeley.minaexplorer.com/wallet/${zkAppAddress}`

export async function getZkbody(answer) {
  try {
    tic('is ready')
    await isReady
    toc()

    setGraphqlEndpoint('https://proxy.berkeley.minaexplorer.com/graphql')

    const address = PublicKey.fromBase58(zkAppAddress)

    const zkApp = new Quiz(address)

    console.log('zkApp', zkApp)

    // account

    tic('fetch account', address)

    const res = await fetchAccount({ publicKey: zkAppAddress }).catch(
      (err) => err
    )

    if (res?.account) console.log(res?.account)

    toc()

    // compile

    tic('begin compile')

    const compile = await Quiz.compile()

    console.log("compile", compile)

    toc()

    // transaction

    tic('zkState')

    const zkState = zkApp.num.get().toString()

    console.log(zkState)

    toc()

    tic('contract update transaction')

    const transaction = await Mina.transaction(() => {
      zkApp.update(Field(answer))
    })

    toc()

    tic('contract update json')

    await transaction.prove().catch((err) => err)

    const partiesJsonUpdate = transaction.toJSON()

    console.log('partiesJsonUpdate', partiesJsonUpdate)

    toc()

    return {
      error: null,
      partiesJsonUpdate: partiesJsonUpdate
    }
  } catch (error) {
    console.log('error', error)
    return {
      error: error,
      partiesJsonUpdate: null
    }
  }
}

export async function getzkState() {
  try {
    tic('is ready')
    await isReady
    toc()

    setGraphqlEndpoint('https://proxy.berkeley.minaexplorer.com/graphql')

    const address = PublicKey.fromBase58(zkAppAddress)

    const zkApp = new Quiz(address)

    console.log('zkApp', zkApp)

    // account

    tic('fetch account', address)

    const res = await fetchAccount({ publicKey: zkAppAddress }).catch(
      (err) => err
    )

    if (res?.account) console.log(res?.account)

    toc()

    // compile

    tic('begin compile')

    const compile = await Quiz.compile()

    console.log("compile", compile)

    toc()

    // transaction

    tic('zkState')

    const zkState = zkApp.num.get().toString()

    return zkState
  } catch (error) {
    return null
  }
}

