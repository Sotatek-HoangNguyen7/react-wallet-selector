/* eslint-disable no-sequences */
/* eslint-disable no-void */
/* eslint-disable no-unused-vars */
import {
  PublicKey,
  Mina,
  PrivateKey,
  fetchAccount,
  isReady,
  Field,
  setGraphqlEndpoint
} from 'snarkyjs'
import { Quiz } from './contract/Quiz'

const senderPrivateKey = 'EKEZvpJoapJyR8DH9zG1PTsrsdF56jdFS5yKLeoJUzagapGtX42t'
const senderAddress = 'B62qqQXYTh8zAoSNS9Nf5mBkA2MxdC7WpbzMd6S1cwtNPzzwD582eDr'

const zkAppPrivateKey =
  'B62qm3p1ZGw3xiWu4x6bfrF2FS4kj2bp1qrHkdM9rr9WscP3g6qNcb6'
// This should be removed once the zkAppAddress is updated.
const zkAppAddress = 'B62qm3p1ZGw3xiWu4x6bfrF2FS4kj2bp1qrHkdM9rr9WscP3g6qNcb6'

// const url = `https://berkeley.minaexplorer.com/wallet/${zkAppAddress}`

export async function getZkbody(answer, fee) {
  try {
    console.log('-start')
    await isReady
    setGraphqlEndpoint('https://proxy.berkeley.minaexplorer.com/graphql')
    // Update this to use the address (public key) for your zkApp account
    // To try it out, you can try this address for an example "Add" smart contract that we've deployed to
    // Berkeley Testnet B62qisn669bZqsh8yMWkNyCA7RvjrL6gfdr3TQxymDHNhTc97xE5kNV
    if (!zkAppAddress) {
      console.error(
        'The following error is caused because the zkAppAddress has an empty string as the public key. Update the zkAppAddress with the public key for your zkApp account, or try this address for an example "Add" smart contract that we deployed to Berkeley Testnet: B62qqkb7hD1We6gEfrcqosKt9C398VLp1WXeTo1i9boPoqF7B1LxHg4'
      )
    }
    const address = PublicKey.fromBase58(zkAppAddress)
    const zkApp = new Quiz(address)
    console.log('zkApp', zkApp)

    // account

    console.log('start get account')
    const account = await fetchAccount(
      { publicKey: zkAppAddress, ...zkApp },
      'https://proxy.berkeley.minaexplorer.com/graphql'
    )
    console.log(`-account:`, account)

    // compile

    console.log('compile start')
    const compile = await Quiz.compile()
    console.log('compile end', compile)

    // transaction

    const zkState = zkApp.num.get().toString()
    console.log('zkState', zkState)
    const transaction = await Mina.transaction(() => {
      zkApp.update(Field(answer))
    })
    await transaction.prove().catch((err) => err)
    const partiesJsonUpdate = transaction.toJSON()
    console.log(partiesJsonUpdate)

    return partiesJsonUpdate

    // const tx = await Mina.transaction(
    //   { sender: PublicKey.fromBase58(senderAddress), fee: fee },
    //   () => {
    //     zkApp.update(Field(answer))
    //   }
    // )
    // console.log(`tx:`, tx)
    // const provedTx = await tx.prove()
    // console.log('send transaction...', provedTx)
    // const sentTx = await tx
    //   .sign([PrivateKey.fromBase58(senderPrivateKey)])
    //   .send()
    // console.log('sentTx:', sentTx)

    // if (sentTx.hash() !== undefined) {
    //   console.log(`
    //     Success! Update transaction sent.

    //     Your smart contract state will be updated
    //     as soon as the transaction is included in a block:
    //     https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
    //     `)
    // }
  } catch (error) {
    console.log('error', error)
  }
}
