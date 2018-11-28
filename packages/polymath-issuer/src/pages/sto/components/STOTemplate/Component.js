// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component, Fragment } from 'react';
import { Button, Icon } from 'carbon-components-react';
import {
  Box,
  LabeledItem,
  Paragraph,
  InlineFlex,
  etherscanAddress,
} from '@polymathnetwork/ui';
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

    // FIXME @RafaelVidaurre: Hardcoding this for now, need to get this value
    // from somewhere
    const isVerified = true;

    const authorAddress = (
      <LabeledItem>
        <LabeledItem.Label>STO Author&apos;s ETH address</LabeledItem.Label>
        <Paragraph>{stoModule.ownerAddress}</Paragraph>
      </LabeledItem>
    );
    const desc = (
      <LabeledItem>
        <LabeledItem.Label>Description</LabeledItem.Label>
        <Paragraph>{stoModule.description}</Paragraph>
      </LabeledItem>
    );
    const verifiedOnEtherscan = (
      <LabeledItem>
        <LabeledItem.Label>Verified on Etherscan</LabeledItem.Label>
        {isVerified ? (
          <InlineFlex as={Paragraph}>
            <Icon name="checkmark--glyph" fill="#00AA5E" />
            &nbsp;Yes
          </InlineFlex>
        ) : (
          <InlineFlex as={Paragraph}>
            <Icon name="close--glyph" fill="red" />
            &nbsp;No
          </InlineFlex>
        )}
      </LabeledItem>
    );
    const securityAuditLink = (
      <LabeledItem>
        <LabeledItem.Label>Third Party Audit</LabeledItem.Label>
        <InlineFlex as={Paragraph}>
          <Icon name="checkmark--glyph" fill="#00AA5E" />
          &nbsp;
          <a href={SECURITY_AUDIT_URL} target="_blank">
            Click here to see report
          </a>
        </InlineFlex>
      </LabeledItem>
    );

    return (
      <div className="pui-page-box sto-factory">
        <h2 className="pui-h2 pui-h-tags">
          {stoModule.title}
          {pickingEnabled ? (
            <Fragment>
              <span className="bx--tag bx--tag--custom">
                Raise Funds in POLY
              </span>
              <span className="bx--tag bx--tag--ibm">Raise Funds in ETH</span>
            </Fragment>
          ) : null}
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
          <Fragment>
            <Box mb={4}>
              <div className="bx--row">
                <div className="bx--col-xs-6">{verifiedOnEtherscan}</div>
                <div className="bx--col-xs-6">{securityAuditLink}</div>
              </div>
            </Box>
            {authorAddress}
            {desc}
          </Fragment>
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
