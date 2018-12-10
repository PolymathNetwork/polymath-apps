// @flow
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/CappedSTOFactory.json';

import IModuleFactory from './IModuleFactory';

class CappedSTOFactory extends IModuleFactory {}

export default new CappedSTOFactory(artifact);
