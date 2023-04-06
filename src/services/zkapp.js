import { isReady, Mina } from 'snarkyjs'

import { Quiz as QuizZkapp } from './contract/Quiz'

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

export async function getZkbody(answer, zkAppAddress) {
  try {
    console.log('is ready')
    await isReady
    tic('contract update transaction')
    const transaction = await Mina.transaction(() => {
      new QuizZkapp().update(answer)
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
