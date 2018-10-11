// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/PolymathRegistry.json';

import Contract from './Contract';

class PolymathRegistry extends Contract {
  test() {
    return 'hola';
  }
}

export default new PolymathRegistry(artifact);
