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

### Available wallets

The wallets available to use in the local blockchain are stored in `wallets.json` and are the following:

```
1:
 - Address: 0xf17f52151ebef6c7334fad080c5704d77216b732
 - Private Key: 0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
2:
 - Address: 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
 - Private Key: 0x0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
3:
 - Address: 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
 - Private Key: 0xc88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
4:
 - Address: 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
 - Private Key: 0x388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
5:
 - Address: 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
 - Private Key: 0x659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
6:
 - Address: 0x2191ef87e392377ec08e7c08eb105ef5448eced5
 - Private Key: 0x82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
7:
 - Address: 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
 - Private Key: 0xaa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
8:
 - Address: 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
 - Private Key: 0x0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
9:
 - Address: 0x5aeda56215b167893e80b4fe645ba6d5bab767de
 - Private Key: 0x8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5
10:
 - Address: 0xe44c4cf797505af1527b11e4f4c6f95531b4be24
 - Private Key: 0xdbb9d19637018267268dfc2cc7aec07e7217c1a2d6733e1184a0909273bf078b
11:
 - Address: 0x69e1cb5cfca8a311586e3406ed0301c06fb839a2
 - Private Key: 0xaa2c70c4b85a09be514292d04b27bbb0cc3f86d306d58fe87743d10a095ada07
12:
 - Address: 0xf014343bdffbed8660a9d8721dec985126f189f3
 - Private Key: 0x3087d8decc5f951f19a442397cf1eba1e2b064e68650c346502780b56454c6e2
13:
 - Address: 0x0e79edbd6a727cfee09a2b1d0a59f7752d5bf7c9
 - Private Key: 0x6125c8d4330941944cc6cc3e775e8620c479a5901ad627e6e734c6a6f7377428
14:
 - Address: 0x9bc1169ca09555bf2721a5c9ec6d69c8073bfeb4
 - Private Key: 0x1c3e5453c0f9aa74a8eb0216310b2b013f017813a648fce364bf41dbc0b37647
15:
 - Address: 0xa23eaef02f9e0338eecda8fdd0a73add781b2a86
 - Private Key: 0xea9fe9fd2f1761fc6f1f0f23eb4d4141d7b05f2b95a1b7a9912cd97bddd9036c
16:
 - Address: 0xc449a27b106be1120bd1fd62f8166a2f61588eb9
 - Private Key: 0xfde045729ba416689965fc4f6d3f5c8de6f40112d2664ab2212208a17842c5c9
17:
 - Address: 0xf24ae9ce9b62d83059bd849b9f36d3f4792f5081
 - Private Key: 0xd714e4a16a539315abb2d86401e4ceae3cf901849769345e3ab64ee46d998b64
18:
 - Address: 0xc44b027a94913fb515b19f04caf515e74ae24fd6
 - Private Key: 0x737f5c61de545d32059ce6d5bc72f7d34b9963310adde62ef0f26621266b65dc
19:
 - Address: 0xcb0236b37ff19001633e38808bd124b60b1fe1ba
 - Private Key: 0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b
```

### Seed JSON structure

The JSON consists of a list of accounts. Each account possesses the following:

- Wallet id (number between 1 and 19, maps to addresses read from `wallets.json`)
- Poly balance
- Array of Security Tokens (optional)

Each Security Token in a list possesses the following:

- Symbol
- Name
- Divisible
- Array of shareholders to mint to (optional)

Each shareholder in a list possesses the following:

- Shareholder wallet id
- Minted amount

#### Example

```json
{
  "accounts": [
    {
      "walletId": 1,
      "polyBalance": 1000000,
      "tokens": [
        {
          "symbol": "A0T0",
          "name": "Token 1",
          "divisible": false,
          "minted": [
            {
              "shareholderId": 3,
              "amount": 1000000
            },
            {
              "shareholderId": 4,
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
              "shareholderId": 5,
              "amount": 1000000
            },
            {
              "shareholderId": 6,
              "amount": 2000000
            }
          ]
        }
      ]
    },
    {
      "walletId": 2,
      "polyBalance": 1000000,
      "tokens": [
        {
          "symbol": "A1T0",
          "name": "Token 3",
          "divisible": false,
          "minted": [
            {
              "shareholderId": 7,
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
      "walletId": 3,
      "polyBalance": 1000000
    },
    {
      "walletId": 4,
      "polyBalance": 1000000
    },
    {
      "walletId": 5,
      "polyBalance": 1000000
    },
    {
      "walletId": 6,
      "polyBalance": 1000000
    },
    {
      "walletId": 7,
      "polyBalance": 1000000
    }
  ]
}
```
