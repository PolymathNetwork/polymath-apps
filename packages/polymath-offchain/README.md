<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

# Polymath offchain

Node service that handles user authentication, emailing, providers and notices that are displayed on the dApps

## Environment variables

You can set the following env vars inside a `.env` file on the package's root

`WEB3_NETWORK_LOCAL_WS`: LOCAL URL for the web3 WebsocketProvider
`WEB3_NETWORK_KOVAN_WS`: KOVAN URL for the web3 WebsocketProvider
`WEB3_NETWORK_MAINNET_WS`: MAINNET URL for the web3 WebsocketProvider

Not all 3 network URLs must be set, but **at least one is required**

`PORT`: Web server's port

`POLYMATH_OFFCHAIN_URL`: The http address of this app
`POLYMATH_ISSUER_URL`: The http address of the issuer app
`NODE_ENV`: Application environment (can be `test`, `development` or `production`)
`DEPLOYMENT_STAGE`: Application deployment stage (can be `local`, `staging` or `production`)

`MONGODB_URI`: The database connection URL
`SENDGRID_API_KEY`: API key of the sendgrid mailing service
