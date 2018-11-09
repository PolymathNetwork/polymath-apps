// @flow

import BigNumber from 'bignumber.js';

import Contract from './Contract';
import PolyToken from './PolyToken';

export default class IModuleFactory extends Contract {
  async setupCost(): Promise<BigNumber> {
    return PolyToken.removeDecimals(await this._methods.setupCost().call());
  }
}
