import {
  fetchAccount,
  isReady,
  Mina,
  PublicKey,
  setGraphqlEndpoint
} from 'snarkyjs'

import { Add as AddZkapp } from './contract/Add'

const timingStack = []
let i = 0

function tic(label = `Run command ${i++}`) {
  console.log(`${label}... `)
  timingStack.push([label, Date.now()])
}

function toc() {
  const [label, start] = timingStack.pop()
  const time = (Date.now() - start) / 1000
  console.log(`\r${label}... ${time.toFixed(3)} sec\n`)
}

export async function getZkbody(url, zkAppAddress) {
  try {
    console.log('is ready')
    await isReady
    toc()
    setGraphqlEndpoint(url)
    const zkappAddress = PublicKey.fromBase58(zkAppAddress)
    tic('fetch account', zkappAddress)
    await fetchAccount({ publicKey: zkAppAddress }).catch((err) => err)
    toc()

    tic('begin compile')
    await AddZkapp.compile(zkappAddress)
    toc()

    tic('contract update transaction')
    const transaction = await Mina.transaction(() => {
      new AddZkapp(zkappAddress).update()
    })
    toc()
    tic('contract update json')
    await transaction.prove().catch((err) => err)
    const partiesJsonUpdate = transaction.toJSON()
    toc()
    return partiesJsonUpdate
  } catch (error) {
    console.log('error', error)
  }
}
