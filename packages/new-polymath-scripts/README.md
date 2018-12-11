# Polymath Scripts

This package contains multiple utility scripts for development purposes

## Generate fixtures

Compiles the JSON artifacts for the Polymath contracts and then deploys them to a local blockchain. A snapshot of the blockchain state is stored in `build/fixtures/blockchain-state`, and the artifacts are stored in `build/fixtures/contracts`.

usage: `yarn local-blockchain:generate-fixtures`

## Start local blockchain

Starts an instance of the ganache CLI and populates the local blockchain with the seed data provided in a JSON file.

usage: `yarn local-blockchain:start --seedData <relative_path_to_json>`

example `yarn local-blockchain:start --seedData ./myData.json`

(The script loads `seedData.json` by default)

### Seed JSON structure

The JSON consists of a list of accounts. Each account possesses the following:

- Address
- Private key
- Poly balance
- Array of Security Tokens (optional)

Each Security Token in a list possesses the following:

- Symbol
- Name
- Divisible
- Array of shareholders to mint to (optional)

Each shareholder in a list possesses the following:

- Shareholder address
- Minted amount

#### Example

```json
{
  "accounts": [
    {
      "address": "0xf17f52151ebef6c7334fad080c5704d77216b732",
      "privateKey": "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
      "polyBalance": 1000000,
      "tokens": [
        {
          "symbol": "A0T0",
          "name": "Token 1",
          "divisible": false,
          "minted": [
            {
              "shareholderAddress": "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
              "amount": 1000000
            },
            {
              "shareholderAddress": "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
              "amount": 2000000
            }
          ]
        },
        {
          "symbol": "A0T1",
          "name": "Token 2",
          "divisible": true,
          "minted": [
            {
              "shareholderAddress": "0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e",
              "amount": 1000000
            },
            {
              "shareholderAddress": "0x2191ef87e392377ec08e7c08eb105ef5448eced5",
              "amount": 2000000
            }
          ]
        }
      ]
    },
    {
      "address": "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef",
      "privateKey": "0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1",
      "polyBalance": 1000000,
      "tokens": [
        {
          "symbol": "A1T0",
          "name": "Token 3",
          "divisible": false,
          "minted": [
            {
              "shareholderAddress": "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5",
              "amount": 1000000
            }
          ]
        },
        {
          "symbol": "A1T1",
          "name": "Token 4",
          "divisible": true
        }
      ]
    },
    {
      "address": "0x821aea9a577a9b44299b9c15c88cf3087f3b5544",
      "privateKey": "0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c",
      "polyBalance": 1000000
    },
    {
      "address": "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2",
      "privateKey": "0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418",
      "polyBalance": 1000000
    },
    {
      "address": "0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e",
      "privateKey": "0x659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63",
      "polyBalance": 1000000
    },
    {
      "address": "0x2191ef87e392377ec08e7c08eb105ef5448eced5",
      "privateKey": "0x82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8",
      "polyBalance": 1000000
    },
    {
      "address": "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5",
      "privateKey": "0xaa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7",
      "polyBalance": 1000000
    }
  ]
}
```
