<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

# Polymath.js

Bridge between the [Polymath Smart Contracts](https://github.com/PolymathNetwork/polymath-core) and dApps.

## Install

```bash
> yarn add polymathjs
```

```javascript
import Contract, { TickerRegistry } from '@polymathnetwork/js'
import type { NetworkParams } from '@polymathnetwork/js/types'

const params: NetworkParams = {
  id: 1, // network id
  web3, // Web3 1.0 instance
  web3WS, // Web3 1.0 instance supplied with WebsocketProvider, it can be the same instance as the one above
  account: '0xaea186fa5402f0a8049786099c3f2881c1e21767', // transactions sender
  txHashCallback: (hash) => console.log(hash), // receives a transaction hash every time one was generated
  txEndCallback: (receipt) => console.log(receipt), // receives a transaction receipt every time one was mined
}

Contract.setParams(params)
```

Consider using the [polymath-auth](https://www.npmjs.com/package/polymath-auth) library, which takes care of the
first 4 params.

## Development
After cloning, to install all dependencies run:
```bash
> yarn
```
We only use Yarn as our official Node package manager, and so we will only commit yarn.lock files, and ignore package-lock.json files.

To build module run:
```
npm run build
```