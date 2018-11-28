[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build status](https://dev.azure.com/polymathnetwork/polymath-apps/_apis/build/status/Build)](https://dev.azure.com/polymathnetwork/polymath-apps/_build/latest?definitionId=2)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Polymath Apps

This is a monorepo containing the webapps and libraries in Polymath. In each package you will find a _Readme_ that describes it.

# Apps and packages

- [Polymath Issuer](https://github.com/PolymathNetwork/polymath-apps/blob/develop/packages/polymath-issuer/README.md)
- [Polymath Investor](https://github.com/PolymathNetwork/polymath-apps/blob/develop/packages/polymath-investor/README.md)

# Setup

In the root of the repository run:

```
yarn install
```

## Installing MongoDB

You will need to run MongoDB in your machine to run the dApps locally

### Windows

Follow [this guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) to install mongodb on windows

### MacOS

You can install mongodb with [Homebrew](https://brew.sh/)

```
brew update
brew install mongodb
```

Mongodb uses `/data/db` as its data folder. If you don't have it you must create
it

```
sudo mkdir -p /data/db
```

Finally, to start mongodb run:

```
brew services restart mongodb
```

# Running an app

Start the local blockchain emulator
`yarn local-blockchain:start`

You may want to retrieve a MetaMask account with ETH prepopulated. Look for the `Private Keys` section in the local blockchain logs from the previous command. You can then pick up any private key and import a new MetaMask account with it.

Once the process finishes, run:
`yarn start:<app>` (for example `yarn start:issuer`)

# Testing

## Unit tests

To run unit tests for all apps in parallel (for CI for example) run in root:
`yarn test`

To run unit tests for a specific app run:
`yarn test:<app>` (for example `yarn test:ui`)

To generate coverage files add run `yarn test --coverage`

You can set the `junit` report directory with the env variable `JEST_JUNIT_OUTPUT_DIR`

## E2E Tests

To also enable test coverage reports for **E2E tests** set `COVERAGE=true` in
your environment

_Instructions pending_

# How to contribute

Please read our [contribution guidelines](https://github.com/PolymathNetwork/polymath-apps/blob/develop/.github/CONTRIBUTING.md)

# Deployments

- Any merge to `master` automatically deploys to [Production](#production)
- Any merge to `develop` automatically deploys to [Staging](#staging)
- Any merge to `release/*` (i.e. `release/2.1.1`) automatically deploys to [Beta](#beta)

## Environments

### Production

What the final user sees, this is [tokenstudio.polymath.network](https://tokenstudio.polymath.network)

### Staging

Production-like environment, this runs code that has not yet made its way into
the master branch.

### Beta

This environment runs the code that is stable enough for an upcoming release. This is [betastudio.polymath.network](https://betastudio.polymath.network)

# Upgrading Smart Contracts

To upgrade the repository to a newer version of the smart contracts
you must do the following:

- Upgrade the `polymath-core` version in [@polymathnetwork/shared](https://github.com/PolymathNetwork/polymath-apps/blob/develop/packages/polymath-shared/README.md)
- Run `local-blockchain:generate-fixtures` inside `packages/polymath-shared`
- Commit new fixtures
