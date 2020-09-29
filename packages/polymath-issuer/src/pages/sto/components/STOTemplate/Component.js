// @flow
/* eslint-disable jsx-a11y/label-has-for */

import React, { Component, Fragment } from 'react';
import { Button, Icon, InlineNotification } from 'carbon-components-react';
import {
  Box,
  Grid,
  LabeledItem,
  Paragraph,
  IconText,
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
        <Paragraph>
          {stoModule.description
            .replace('(ETH, POLY or DAI)', '(ETH or DAI)')
            .replace(' (ETH or POLY)', '')}
        </Paragraph>
      </LabeledItem>
    );
    const investorsNote = (
      <InlineNotification
        hideCloseButton
        title={
          <p>
            Please make note to your investors that they may need to{' '}
            <a href="https://metamask.zendesk.com/hc/en-us/articles/360015488771-How-to-Adjust-Gas-Price-and-Gas-Limit-">
              adjust the gas limit in metamask
            </a>{' '}
            to 450,000 in order to successfully participate in your STO. If gas
            limit of 450,000 does not work, please ask them to increase the
            limit slightly by 150,000 until the transaction goes through.
          </p>
        }
        subtitle=""
        kind="warning"
      />
    );
    const verifiedOnEtherscan = (
      <LabeledItem>
        <LabeledItem.Label>Verified on Etherscan</LabeledItem.Label>
        {isVerified ? (
          <Paragraph>
            <IconText>
              <Icon name="checkmark--glyph" fill="#00AA5E" /> <span>Yes</span>
            </IconText>
          </Paragraph>
        ) : (
          <Paragraph>
            <IconText>
              <Icon name="close--glyph" fill="red" /> <span>No</span>
            </IconText>
          </Paragraph>
        )}
      </LabeledItem>
    );
    const securityAuditLink = (
      <LabeledItem>
        <LabeledItem.Label>Third Party Audit</LabeledItem.Label>
        <Paragraph>
          <IconText>
            <Icon name="checkmark--glyph" fill="#00AA5E" />
            &nbsp;
            <a href={SECURITY_AUDIT_URL} target="_blank">
              Click here to see report
            </a>
          </IconText>
        </Paragraph>
      </LabeledItem>
    );

    return (
      <div className="pui-page-box sto-factory">
        <h2 className="pui-h2 pui-h-tags">
          {stoModule.title}
          {pickingEnabled ? (
            <Fragment>
              {stoModule.type === 'CappedSTO' && (
                <span className="bx--tag bx--tag--ibm">Raise Funds in ETH</span>
              )}
              {stoModule.type === 'USDTieredSTO' && (
                <span className="bx--tag bx--tag--third-party">
                  Raise Funds in Stablecoin
                </span>
              )}
            </Fragment>
          ) : null}
        </h2>
        <br />
        <br />
        {pickingEnabled ? (
          <Grid.Row>
            <Grid.Col gridSpan={[12, 8]}>
              {authorAddress}
              {desc}
              {investorsNote}
            </Grid.Col>
            <Grid.Col gridColumn={['1 / 13', '9 / span 4', '10 / span 3']}>
              {verifiedOnEtherscan}
              {securityAuditLink}
            </Grid.Col>
          </Grid.Row>
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
