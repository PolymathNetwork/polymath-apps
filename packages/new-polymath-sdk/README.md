# Polymath SDK

A Javascript SDK for interacting with the Polymath network for the browser and Node.js

# Usage

First, configure your Polymath Client:

```ts
// polyClient.ts
import { Polymath, browserUtils } from '@polymathnetwork/sdk';

// create the necessary Web3 providers on its own. You can pass custom ones
// if you want though.
const config = {
  polymathRegistryAddress: '0x1234...',
};

// You could have multiple configs for each network you support:
const networkConfigs = {
  ['1']: {
    /* */
  },
  ['42']: {
    /* */
  },
};
const networkId = browserUtils.getNetworkId();
const config = networkConfigs[networkId];

// You'll want to reuse the smae instance of the Polymath client in the rest of
// your app for the same network.
export const polyClient = new Polymath(config);
```

Initializing your client

```ts
import { polyClient } from './polyClient';

// These two steps need to be done once, somewhere in your app

// Initializes the client with network data
await polyClient.connect();

// This only needs to be done for browsers, it will obtain the user's address
// popping up metamask's dialog to ask the user for access. This should be used
// to control the "login" flow of your application, it will throw meaningful
// exceptions depending on what the result was
try {
  await browserUtils.getCurrentAddress();
} catch (err) {
  switch (code) {
    case ErrorCodes.UserDeniedAccess: {
      // User didn't allow access
      break;
    }
    case ErrorCodes.IncompatibleBrowser: {
      // Browser does not support Ethereum
      break;
    }
    case ErrorCodes.WalletIsLocked: {
      // The user needs to unlock his/her wallet first
      break;
    }
  }
}
```

Finally, let's start a procedure to reserve a Security Token

```ts
// Builds a list of transactions required to reserve a security token
const transactionQueue = await polyClient.reserveSecurityToken({
  name: 'My Token',
  symbol: 'MY-TOKEN',
});

// We can listen to events for individual transactions as well as the queue
// itself. For now, let's just listen to the whole queue

await transactionQueue.run(); // Will run sequentially every transaction required

// At this point my token has been reserved
const myTokenReservation = await polyClient.getSecurityTokenReservation({
  symbol: 'MY-TOKEN',
});
```

**To be continued...**
