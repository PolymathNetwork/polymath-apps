// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/GeneralPermissionManager.json';

import Contract from './Contract';
import type { Address } from '../types';

export default class PermissionManager extends Contract {
  constructor(at: Address) {
    super(artifact, at);
  }
}
