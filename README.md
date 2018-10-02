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
`yarn install`

# Running an app

Start the local blockchain emulator
`yarn local-blockchain:start`

Once the process finishes, run:
`yarn start:<app>` (for example `yarn start:issuer`)

# Testing

## Unit tests

To run unit tests for all apps in parallel (for CI for example) run in root:
`yarn test`

To run unit tests for a specific app run:
`yarn test:<app>` (for example `yarn test:ui`)

## E2E Tests

To also enable test coverage reports for **E2E tests** set `COVERAGE=true` in
your environment

_Instructions pending_

# How to contribute

Please read our [contribution guidelines](https://github.com/PolymathNetwork/polymath-apps/blob/develop/.github/CONTRIBUTING.md)

## Branches

All your contributed code must live in a feature branch before getting merged to the main `develop` branch.

- First, checkout `develop` (feature branches need to branch off of `develop`).
- Then create your feature branch following this naming convention: `feature/your-branch-name`.
- Once you're happy with your code, you can now submit a pull request.

Make sure you always push into a feature branch and not directly to `master` / `develop`.
