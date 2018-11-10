// @flow

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { reduce } from 'lodash';
import { Button } from 'carbon-components-react';
import {
  Box,
  ProgressBar,
  Countdown,
  etherscanAddress,
} from '@polymathnetwork/ui';
import { format } from '@polymathnetwork/shared/utils';
import {
  togglePauseSto,
  exportInvestorsList,
} from '../../../../../../actions/sto';
import TiersTable from './TiersTable';

import type { Dispatch } from 'redux';
import type { CountdownProps } from '@polymathnetwork/ui';
import type { RootState } from '../../../../../../redux/reducer';
import type { SecurityToken, USDTieredSTO } from '../../../../../../constants';

type ComponentProps = {|
  token: SecurityToken,
  handlePause: () => void,
  handleExportInvestors: () => void,
  sto: USDTieredSTO,
|};

type StateProps = {|
  sto: USDTieredSTO,
  token: SecurityToken,
  dispatch: Dispatch<any>,
|};
type ContainerProps = StateProps;

// FIXME @RafaelVidaurre: etherscanAddress should be a component
const dateFormat = (date: Date) =>
  date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const getCountdownProps = (
  startDate: Date,
  endDate: Date,
  pauseStatus: boolean
): ?CountdownProps => {
  const now = new Date();
  if (now < startDate) {
    return {
      deadline: startDate,
      title: 'Time Left Until the Offering Starts',
      isPaused: pauseStatus,
    };
  } else if (now < endDate) {
    return {
      deadline: endDate,
      title: 'Time Left Until the Offering Ends',
      isPaused: pauseStatus,
    };
  }
  return null;
};

const USDTieredSTOOverviewComponent = ({
  token,
  handlePause,
  handleExportInvestors,
  sto,
}: ComponentProps) => {
  const totalUsdRaised = sto.totalUsdRaised;
  const countdownProps = getCountdownProps(
    sto.startDate,
    sto.endDate,
    sto.pauseStatus
  );
  const totalUsdCap = reduce(
    sto.tiers,
    (total, { totalUsd }) => totalUsd.plus(total),
    new BigNumber(0)
  );
  const totalUsdRaisedPercent = (totalUsdRaised / totalUsdCap) * 100;
  const totalUsdRaisedText = totalUsdRaisedPercent.toFixed(1);
  const ticker = token.ticker.toUpperCase();
  const raised = sto.totalUsdRaised;
  const totalTokensSold = sto.totalTokensSold;

  return (
    <DocumentTitle title={`${ticker} STO Overview – Polymath`}>
      <div>
        <h1 className="pui-h1">Security Token Overview</h1>
        <br />
        <div className="pui-page-box">
          <h2 className="pui-h2">USD Tiered STO</h2>
          <p className="pui-sto-status-contract">
            Contract {etherscanAddress(sto.address)}
          </p>
          <div
            className={
              'pui-sto-status-grow' + (sto.pauseStatus ? ' pui-paused' : '')
            }
          >
            <div className="pui-sto-status-numbers">
              <div>{totalUsdRaisedText}%</div>
              <div className="pui-key-value">
                <div>Cap</div>
                {format.toUSD(totalUsdCap)}
              </div>
            </div>
            <ProgressBar
              className="pui-sto-status-progress-bar"
              progress={totalUsdRaisedPercent / 100}
            />
            <div className="pui-sto-status-bottom-row">
              <div className="pui-sto-status-dates">
                <div className="pui-key-value">
                  <div>Start Date</div>
                  {dateFormat(sto.startDate)}
                </div>
                <div className="pui-key-value">
                  <div>End Date</div>
                  {dateFormat(sto.endDate)}
                </div>
              </div>
              <div>
                <div className="pui-key-value pui-countdown-raised">
                  <div>Total Funds Raised</div>
                  {`${format.toUSD(raised)} USD`}
                  <div>
                    {format.toTokens(totalTokensSold, { decimals: 2 })} {ticker}
                  </div>
                </div>
              </div>
            </div>
            <Box mt={4}>
              <TiersTable sto={sto} />
            </Box>
            <Button
              icon="download"
              kind="secondary"
              onClick={handleExportInvestors}
            >
              Export List Of Investors
            </Button>
          </div>
          {countdownProps != null && (
            <div className="pui-countdown-container">
              <Countdown
                deadline={countdownProps.deadline}
                title={countdownProps.title}
                buttonTitle={sto.pauseStatus ? 'RESUME STO' : 'PAUSE STO'}
                handleButtonClick={handlePause}
                isPaused={sto.pauseStatus}
              />
            </div>
          )}
          <div className="pui-clearfix" />
        </div>
      </div>
    </DocumentTitle>
  );
};

const mapStateToProps = ({ sto, token: { token } }: RootState) => {
  return { sto: sto.details, token };
};

class USDTieredSTOOverviewContainer extends Component<ContainerProps> {
  pause = () => {
    const { dispatch } = this.props;
    dispatch(togglePauseSto());
  };

  exportInvestors = () => {
    const { dispatch } = this.props;
    dispatch(exportInvestorsList());
  };

  render() {
    const { sto, token } = this.props;

    return (
      <USDTieredSTOOverviewComponent
        token={token}
        sto={sto}
        handleExportInvestors={this.exportInvestors}
        handlePause={this.pause}
      />
    );
  }
}

export default connect(mapStateToProps)(USDTieredSTOOverviewContainer);
