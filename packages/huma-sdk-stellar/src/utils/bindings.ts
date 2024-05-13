/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import 'dotenv/config'

import { spawn } from 'child_process'
import process from 'process'

import { StellarNetwork, NetworkMetadatas } from './network'

const cmd = (...command: string[]) => {
  const p = spawn(command[0], command.slice(1))
  return new Promise((resolveFunc) => {
    p.stdout.on('data', (x) => {
      process.stdout.write(x.toString())
    })
    p.stderr.on('data', (x) => {
      process.stderr.write(x.toString())
    })
    p.on('exit', (code) => {
      resolveFunc(code)
    })
  })
}

// Typescript bindings doc: https://developers.stellar.org/docs/smart-contracts/getting-started/create-an-app#generate-an-npm-package-for-the-hello-world-contract
;(async () => {
  const testnetMetadata = NetworkMetadatas.find(
    (x) => x.network === StellarNetwork.testnet,
  )
  const { contracts } = testnetMetadata.pools[0]
  const contractNames = Object.keys(contracts)
  for (let contractName of contractNames) {
    // @ts-ignore
    const contractAddress = contracts[contractName]
    if (contractName === 'seniorTranche') {
      continue
    }
    if (contractName === 'juniorTranche') {
      contractName = 'trancheVault'
    }

    console.log('Starting bindings for', contractName)

    let test = `soroban contract bindings typescript --network ${StellarNetwork.testnet}
        --output-dir src/packages/${contractName} --overwrite --contract-id ${contractAddress}`
    test = test.replace(/(\r\n|\n|\r)/gm, '')
    await cmd('bash', '-c', test)
    console.log('Finished bindings for', contractName)
  }
})()
