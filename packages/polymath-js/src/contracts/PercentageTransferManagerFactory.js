// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/PercentageTransferManagerFactory.json';

import IModuleFactory from './IModuleFactory';

class PercentageTransferManagerFactory extends IModuleFactory {}

export default new PercentageTransferManagerFactory(artifact);
