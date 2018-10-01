// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/CountTransferManagerFactory.json';

import IModuleFactory from './IModuleFactory';

class CountTransferManagerFactory extends IModuleFactory {}

export default new CountTransferManagerFactory(artifact);
