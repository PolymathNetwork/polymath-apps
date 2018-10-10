# Polymath Shared

This repository is a local dependency for compile-time. It holds common
utilities and other resources within the different packages of this workspace

## Local Blockchain

This repo contains the JSON artifacts of the smart contracts
for other packages to use. It also contains a fixed state of the local blockchain
from which ganache will start off anytime `local-blockchain:start` is run.

The purpose of having these stored in version control is to ensure any developer
has exactly the same blockchain state when running the app in their local
environment.

**Note: The fixed blockchain state and JSON artifacts must be regenerated when
a new version of `polymath-core` is used. For this the `local-blockchain:generate` command has to be run**
