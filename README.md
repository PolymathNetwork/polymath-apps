[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build status](https://dev.azure.com/polymathnetwork/polymath-apps/_apis/build/status/Build)](https://dev.azure.com/polymathnetwork/polymath-apps/_build/latest?definitionId=2)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Polymath Apps

This is a monorepo containing the webapps and libraries in Polymath. In each package you will find a _Readme_ that describes it.

# Setup

In the root of the repository run:
`yarn install`

# Running an app

Start the local blockchain emulator
`yarn local-blockchain:start`

Next, migrate the contracts in the blockchain
`yarn local-blockchain:migrate`

Once the process finishes, run:
`yarn start:<app>` (for example `yarn start:issuer`)

# Testing

## Unit tests

To run unit tests for all apps in parallel (for CI for example) run in root:
`yarn test`

To run unit tests for a specific app run:
`yarn test:<app>` (for example `yarn test:ui`)

## E2E Tests

_Instructions pending_

# How to contribute

## Commits

This repo requires the use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

**Commit convention: The following rules are subject to change based on wether they work for us or not.**

- Add a `body` to the commit if the commit's subject is not descriptive enough
- Add a `BREAKING CHANGE: <explanation>` in the footer of a commit that makes
  a breaking change of the API of a package
- Add a `CLOSES ISSUE: #<number>` in the footer of a commit to close an issue
  this commit solves
- Commit messages must be written in imperative tense
- The `scope` defines what package is affected by a commit (enforced by [config-lerna-scopes](https://www.npmjs.com/package/@commitlint/config-lerna-scopes))
- For changes not associated to a package, scope can be omitted
- Relevant types that define changes in [semver]() versioning are:
  - `fix`: Bumps patch version. Use when the commit represents a bugfix
  - `feat`: Bumps minor version. Use when the commit adds a new feature
- Other types which do not affect versioning are:
  - `build`: Affects the build system or external dependencies.
  - `chore`: Other changes that don't modify src or test files
  - `ci`: Changes CI configuration files and scripts.
  - `docs`: Adds or alters documentation.
  - `perf`: Improves performance.
  - `refactor`: Rewrites code without feature, performance or bug changes.
  - `revert`: Reverts a previous commit.
  - `style`: Improves formatting, white-space.
  - `test`: Adds or modifies tests.

**Tools:**

- If you don't want to worry about formatting, you can run `yarn commit` to
  run a cli tool that will guide you through the committing process.\_
- [VSCode Committizen Extension](https://marketplace.visualstudio.com/items?itemName=KnisterPeter.vscode-commitizen)

## Branches

All your contributed code must live in a feature branch before getting merged to the main `develop` branch.

- First, checkout `develop` (feature branches need to branch off of `develop`).
- Then create your feature branch following this naming convention: `feature/your-branch-name`.
- Once you're happy with your code, you can now submit a pull request.

Make sure you always push into a feature branch and not directly to `master` / `develop`.
