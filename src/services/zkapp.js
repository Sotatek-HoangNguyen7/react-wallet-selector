import {
  Mina,
  isReady,
  PublicKey,
  fetchAccount,
  setGraphqlEndpoint
} from 'snarkyjs'

import { Quiz as QuizZkapp } from './contract/Quiz'

const timingStack = []
const zkAppAddress = 'B62qrNT39BFhsqy85CCr4uemcfcgSxQVYf9hJHEYEzJ8Kf4U3bcgaGc'
const url = `https://berkeley.minaexplorer.com/wallet/${zkAppAddress}`

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

export async function getZkbody(answer) {
  try {
    tic('is ready')
    await isReady
    toc()
    setGraphqlEndpoint(url)
    const zkappAddress = PublicKey.fromBase58(zkAppAddress)
    const zkApp = new QuizZkapp(zkappAddress)
    tic('fetch account', zkappAddress)
    await fetchAccount({ publicKey: zkAppAddress }).catch((err) =>
      console.log(err)
    )
    toc()
    tic('begin compile')
    await zkApp.compile(zkappAddress)
    toc()
    tic('contract update transaction')
    const transaction = await Mina.transaction(() => {
      zkApp(zkappAddress).update(answer)
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
