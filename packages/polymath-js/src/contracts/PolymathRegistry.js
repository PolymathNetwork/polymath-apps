// @flow

import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/PolymathRegistry.json';

import Contract from './Contract';

class PolymathRegistry extends Contract {}

export default new PolymathRegistry(artifact);
