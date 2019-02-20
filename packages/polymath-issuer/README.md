<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

## Development

## Troubleshoot

- Try to clean your Metamask cache: Settings > Reset Accounts

# Environment variables

You can set the following env vars inside a `.env` file on the package's root

`REACT_APP_NETWORK_KOVAN_WS`: To connect to Kovan locally
`REACT_APP_NETWORK_MAIN_WS`: To connect to the Mainnet locally
`REACT_APP_ALLOW_GANACHE_ONLY`: Allows usage of ganache without Metamask when running in local stage

## Running without Metamask

1. Create a `.env` file in `packages/polymath-issuer`
2. Add `REACT_APP_ALLOW_GANACHE_ONLY=true` to the `.env`
3. Make sure you have `mongodb` set up and running
4. Run the following commands:

- `yarn local-blockchain:start`
- `yarn start:offchain`
- `yarn start:issuer`

5. Disable the Metamask extension in your browser if it is enabled
