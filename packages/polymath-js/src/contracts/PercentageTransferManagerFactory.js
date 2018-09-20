// @flow

import artifact from '@polymathnetwork/shared/build/contracts/PercentageTransferManagerFactory.json';

import IModuleFactory from './IModuleFactory';

class PercentageTransferManagerFactory extends IModuleFactory {}

export default new PercentageTransferManagerFactory(artifact);
