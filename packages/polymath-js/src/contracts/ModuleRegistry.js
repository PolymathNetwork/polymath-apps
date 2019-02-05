// @flow

import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ModuleRegistry.json';

import Contract from './Contract';

class ModuleRegistry extends Contract {}

export default new ModuleRegistry(artifact);
