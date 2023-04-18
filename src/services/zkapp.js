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

import { Square } from './contract/Quiz'

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

const zkAppAddress = 'B62qoTyWQjipMkRHe2EbVnAjaJ8NuV1u3EzsERmH1ArxZQSYu4WYjou'

export async function getZkbody(answer) {
  try {
    tic('is ready')
    await isReady
    toc()

    setGraphqlEndpoint('https://proxy.berkeley.minaexplorer.com/graphql')

    const address = PublicKey.fromBase58(zkAppAddress)

    const zkApp = new Square(address)

    console.log('zkApp', zkApp)

    // account

    tic('fetch account', address)

    const res = await fetchAccount({ publicKey: zkAppAddress })

    if (res?.account) console.log(res?.account)

    toc()

    // compile

    tic('begin compile')

    const compile = await Square.compile()

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

    await transaction.prove()

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

    const zkApp = new Square(address)

    console.log('zkApp', zkApp)

    // account

    tic('fetch account', address)

    const res = await fetchAccount({ publicKey: zkAppAddress })

    if (res?.account) console.log(res?.account)

    toc()

    tic('begin compile')

    const compile = await Square.compile()

    console.log("compile", compile)

    toc()

    tic('zkState')

    const zkState = zkApp.num.get().toString()

    console.log(zkState);

    toc()

    return zkState
  } catch (error) {
    return null
  }
}

