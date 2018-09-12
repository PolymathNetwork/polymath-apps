// @flow

import artifact from 'polymath-core/build/contracts/CountTransferManagerFactory.json';

import IModuleFactory from './IModuleFactory';

class CountTransferManagerFactory extends IModuleFactory {}

export default new CountTransferManagerFactory(artifact);
