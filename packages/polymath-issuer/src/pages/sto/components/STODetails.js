// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component } from 'react';
import { Button, Icon } from 'carbon-components-react';
import { etherscanAddress } from '@polymathnetwork/ui';
import { DisabledTooltip } from '@polymathnetwork/ui/components';
import type { STOFactory } from '@polymathnetwork/js/types';

type Props = {|
  item: STOFactory,
  handleUseSTO?: () => Function,
|};

export default class STODetails extends Component<Props> {
  render() {
    const { item, handleUseSTO } = this.props;

    const isSelect = handleUseSTO !== undefined;
    const authorAddress = (
      <div className="bx--form-item">
        <label className="bx--label">STO Author&apos;s ETH address</label>
        <p>{item.owner}</p>
      </div>
    );
    const desc = (
      <div className="bx--form-item">
        <label className="bx--label">Description</label>
        <p>{item.desc}</p>
      </div>
    );
    const verifiedOnEtherscan = (
      <div className="bx--form-item">
        <label className="bx--label">Verified on Etherscan</label>
        {item.isVerified ? (
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
          <a href={item.securityAuditLink.url} target="_blank">
            Click here to see report
          </a>
        </p>
      </div>
    );
    return (
      <div className="pui-page-box sto-factory">
        <h2 className="pui-h2 pui-h-tags">
          {item.title}
          <span className="bx--tag bx--tag--custom">Raise Funds in POLY</span>
          <span className="bx--tag bx--tag--ibm">Raise Funds in ETH</span>
        </h2>
        <br />
        <br />
        {isSelect ? (
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
        <div style={isSelect ? { textAlign: 'right' } : {}}>
          {etherscanAddress(
            item.address,
            <Button kind="secondary" className="see-on-etherscan-link">
              See on Etherscan
            </Button>
          )}
          {isSelect ? (
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                // onClick={handleUseSTO} NOTE @monitz87: re-enable after the 11/15/2018 release
                onClick={() => null}
                disabled={true}
              >
                <DisabledTooltip
                  label="SELECT AND CONFIGURE STO"
                  title="STOs temporarily disabled"
                  content="Polymath is currently migrating your tokens to an upgraded 2.0 release. Token distribution and configuration is disabled during this period and will resume by Nov. 15th - 12:00pm ET. We hope you enjoy the added functionality of your upgraded security tokens, and we apologize for any inconvenience."
                  direction="top"
                />
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
