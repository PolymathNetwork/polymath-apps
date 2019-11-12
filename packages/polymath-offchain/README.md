<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

# Polymath offchain

Node service that handles user authentication, emailing, providers and notices that are displayed on the dApps

## Environment variables

You can set the following env vars inside a `.env` file on the package's root

Depending on the deployment stage, you will have to set one or more of the following URLs and addresses:

`WEB3_NETWORK_LOCAL_WS`: LOCAL URL for the web3 WebsocketProvider (mandatory in local, optional in staging and production)
`WEB3_NETWORK_LOCALVM_WS`: LOCAL VM URL for the web3 WebSocketProvider (used for cross-browser testing, optional in all stages. If this is set then `WEB3_NETWORK_LOCAL_WS` cannot be set and vice-versa)
`WEB3_NETWORK_KOVAN_WS`: KOVAN URL for the web3 WebsocketProvider (optional in local, mandatory in staging and production)
`WEB3_NETWORK_GOERLI_WS`: GOERLI URL for the web3 WebsocketProvider (optional in local, mandatory in staging and production)
`WEB3_NETWORK_MAINNET_WS`: MAINNET URL for the web3 WebsocketProvider (unused in local and staging, mandatory in production)

`POLYMATH_REGISTRY_ADDRESS_LOCAL`: Address of the deployed PolymathRegistry in the local blockchain (mandatory in local, optional in staging and production)
`POLYMATH_REGISTRY_ADDRESS_KOVAN`: Address of the deployed PolymathRegistry in the Kovan testnet (optional in local, mandatory in staging and production)
`POLYMATH_REGISTRY_ADDRESS_GOERLI`: Address of the deployed PolymathRegistry in the Goerli testnet (optional in local, mandatory in staging and production)
`POLYMATH_REGISTRY_ADDRESS_MAINNET`: Address of the deployed PolymathRegistry in Mainnet (unused in local and staging, mandatory in production)

`PORT`: Web server's port

`POLYMATH_OFFCHAIN_URL`: The http address of this app
`POLYMATH_ISSUER_URL`: The http address of the issuer app
`NODE_ENV`: Application environment (can be `test`, `development` or `production`)
`DEPLOYMENT_STAGE`: Application deployment stage (can be `local`, `staging` or `production`)

`MONGODB_URI`: The database connection URL
`SENDGRID_API_KEY`: API key of the sendgrid mailing service
