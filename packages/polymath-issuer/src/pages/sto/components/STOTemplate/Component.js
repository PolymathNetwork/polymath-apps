// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react';
import { Button, Icon } from 'carbon-components-react';
import { etherscanAddress } from '@polymathnetwork/ui';
import { SECURITY_AUDIT_URL } from '../../../../constants';

import type { STOModule } from '../../../../constants';

type Props = {|
  stoModule: STOModule,
  handlePickSTOTemplate: () => void,
  pickingEnabled?: boolean,
|};

export default class STOTemplateComponent extends Component<Props> {
  render() {
    const { stoModule, handlePickSTOTemplate, pickingEnabled } = this.props;
    console.log('stoModule', stoModule);

    // FIXME @RafaelVidaurre: Hardcoding this for now, need to get this value
    // from somewhere
    const isVerified = true;

    const authorAddress = (
      <div className="bx--form-item">
        <label className="bx--label">STO Author&apos;s ETH address</label>
        <p>{stoModule.ownerAddress}</p>
      </div>
    );
    const desc = (
      <div className="bx--form-item">
        <label className="bx--label">Description</label>
        <p>{stoModule.description}</p>
      </div>
    );
    const verifiedOnEtherscan = (
      <div className="bx--form-item">
        <label className="bx--label">Verified on Etherscan</label>
        {isVerified ? (
          <p>
            <Icon name="checkmark--glyph" fill="#00AA5E" />
            &nbsp;Yes
          </p>
        ) : (
          <p>
            <Icon name="close--glyph" fill="red" />
            &nbsp;No
          </p>
        )}
      </div>
    );
    const securityAuditLink = (
      <div className="bx--form-item">
        <label className="bx--label">Third Party Audit</label>
        <p>
          <Icon name="checkmark--glyph" fill="#00AA5E" />
          <a href={SECURITY_AUDIT_URL} target="_blank">
            Click here to see report
          </a>
        </p>
      </div>
    );

    return (
      <div className="pui-page-box sto-factory">
        <h2 className="pui-h2 pui-h-tags">
          {stoModule.title}
          <span className="bx--tag bx--tag--custom">Raise Funds in POLY</span>
          <span className="bx--tag bx--tag--ibm">Raise Funds in ETH</span>
        </h2>
        <br />
        <br />
        {pickingEnabled ? (
          <div className="bx--row">
            <div className="bx--col-xs-8">
              {authorAddress}
              {desc}
            </div>
            <div className="bx--col-xs-2">&nbsp;</div>
            <div className="bx--col-xs-2">
              {verifiedOnEtherscan}
              {securityAuditLink}
            </div>
          </div>
        ) : (
          <div className="bx--row">
            <div className="bx--col-xs-9">
              {authorAddress}
              {desc}
            </div>
            <div className="bx--col-xs-3">
              {verifiedOnEtherscan}
              {securityAuditLink}
            </div>
          </div>
        )}
        <div style={pickingEnabled ? { textAlign: 'right' } : {}}>
          {etherscanAddress(
            stoModule.address,
            <Button kind="secondary" className="see-on-etherscan-link">
              See on Etherscan
            </Button>
          )}
          {pickingEnabled ? (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button onClick={handlePickSTOTemplate}>
                SELECT AND CONFIGURE STO
              </Button>
            </span>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
