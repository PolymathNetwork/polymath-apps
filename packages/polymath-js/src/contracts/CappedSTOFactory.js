// @flow

import artifact from 'polymath-core/build/contracts/CappedSTOFactory.json';

import IModuleFactory from './IModuleFactory';

class CappedSTOFactory extends IModuleFactory {}

export default new CappedSTOFactory(artifact);
