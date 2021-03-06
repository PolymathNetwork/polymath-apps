// @flow
import semver from 'semver';
import artifact from '@polymathnetwork/polymath-scripts/fixtures/contracts/ManualApprovalTransferManager.json';
import { LATEST_PROTOCOL_VERSION } from '../constants';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import type { Address } from '../types';

export default class ManualApprovalTransferManager extends Contract {
  version: string = LATEST_PROTOCOL_VERSION;
  constructor(at: Address, version?: string = LATEST_PROTOCOL_VERSION) {
    super(artifact, at);
    version = version;
  }

  async addManualApproval(
    from: Address,
    to: Address,
    allowance: BigNumber,
    expiryTime: Date,
    description: string
  ) {
    return this._tx(
      this._methods.addManualApproval(
        from,
        to,
        allowance,
        expiryTime / 1000,
        this._toBytes(description)
      )
    );
  }

  async modifyManualApproval(
    from: Address,
    to: Address,
    expiryTime: Date,
    changeInAllowance: BigNumber,
    description: string,
    increase: boolean
  ) {
    return this._tx(
      this._methods.modifyManualApproval(
        from,
        to,
        expiryTime / 1000,
        changeInAllowance,
        this._toBytes(description),
        increase
      )
    );
  }

  async revokeManualApproval(from: Address, to: Address) {
    return this._tx(this._methods.revokeManualApproval(from, to));
  }

  async getAllApprovals() {
    const approvals = await this._methods.getAllApprovals().call();
    const formattedApprovals = [];

    for (let i = 0; i < approvals['0'].length; i++) {
      let a = {};

      a.id = (approvals['0'][i] + approvals['1'][i]).toLowerCase();
      a.fromAddress = approvals['0'][i];
      a.toAddress = approvals['1'][i];
      a.expiry = approvals['4'][i];

      const events = await this._contractWS.getPastEvents('AddManualApproval', {
        filter: { _from: a.fromAddress, _to: a.toAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });

      const modifyEvents = await this._contractWS.getPastEvents(
        'ModifyManualApproval',
        {
          filter: { _from: a.fromAddress, _to: a.toAddress },
          fromBlock: 0,
          toBlock: 'latest',
        }
      );

      if (
        modifyEvents.length > 0 &&
        modifyEvents[modifyEvents.length - 1].blockNumber >
          events[events.length - 1].blockNumber
      ) {
        a.txHash = modifyEvents[modifyEvents.length - 1].transactionHash;
      } else {
        a.txHash = events[events.length - 1].transactionHash;
      }

      a.tokens = this._fromWei(approvals['2'][i]).toString();
      a.tokensTransferred = (
        this._fromWei(approvals['2'][i]) - this._fromWei(approvals['3'][i])
      ).toString();
      a.description = this._toAscii(approvals['5'][i]);
      formattedApprovals.push(a);
    }
    return formattedApprovals;
  }
}
