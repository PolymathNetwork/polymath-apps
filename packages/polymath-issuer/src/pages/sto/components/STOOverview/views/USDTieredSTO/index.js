// @flow

import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { reduce } from 'lodash';
import { Button } from 'carbon-components-react';
import {
  Page,
  Box,
  Flex,
  Grid,
  ProgressBar,
  Countdown,
  etherscanAddress,
  RaisedAmount,
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

// FIXME @RafaelVidaurre: We should either have a dedicated component for
// STO statuses or properly generalize the Countdown component
const getCountdownProps = ({
  startDate,
  endDate,
  pauseStatus: isPaused,
  isTerminated,
  capReached,
  isOpen,
}: USDTieredSTO): CountdownProps => {
  let deadline: Date;
  let title: string;
  let buttonTitle: ?string;

  const now = new Date();
  const isFinished = (capReached && !isOpen) || now >= endDate;
  const hasStarted = now >= startDate;
  const isRunning = hasStarted && !isPaused && !isTerminated && !isFinished;

  // Set the title's text
  if (!hasStarted) {
    title = 'Time Left Until the Offering Starts';
  } else if (isRunning) {
    title = 'Time Left Until the Offering Ends';
  } else if (isTerminated) {
    title = 'The Sale Is Terminated';
  } else if (isFinished) {
    title = 'The Sale Is Closed';
  }
  // Enable the pause button if the sto is not closed
  if (!isFinished && !isTerminated) {
    buttonTitle = isPaused ? 'RESUME' : 'PAUSE';
  }
  // Set the countdown time
  if (!hasStarted) {
    deadline = startDate;
  } else if (isRunning) {
    deadline = endDate;
  } else {
    deadline = new Date(0);
  }

  return {
    title,
    deadline,
    isPaused,
    buttonTitle,
  };
};

const USDTieredSTOOverviewComponent = ({
  token,
  handlePause,
  handleExportInvestors,
  sto,
}: ComponentProps) => {
  const totalUsdRaised = sto.totalUsdRaised;

  const [countdownProps, setCountDown] = useState(getCountdownProps(sto));

  useEffect(() => {
    const now = new Date();
    const { startDate, endDate } = sto;
    if (now < startDate) {
      const timeUntilStart = startDate - now;
      setTimeout(() => {
        setCountDown(getCountdownProps(sto));
      }, timeUntilStart);
    } else if (now < endDate) {
      const timeUntilEnd = endDate - now;
      setTimeout(() => {
        setCountDown(getCountdownProps(sto));
      }, timeUntilEnd);
    }
  });
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
    <Page title={`${ticker} STO Overview – Polymath`}>
      <div>
        <h1 className="pui-h1">Security Token Overview</h1>
        <br />
        <div className="pui-page-box">
          <h2 className="pui-h2">USD Tiered STO</h2>
          <p className="pui-sto-status-contract">
            Contract {etherscanAddress(sto.address)}
          </p>
          <Grid
            gridTemplateAreas={[
              `
                "countdown"
                "main"
                "table"
              `,
              `
                "countdown"
                "main"
                "table"
              `,
              `
                "main countdown"
                "table table"
              `,
              `
                "main countdown"
                "table ."
              `,
            ]}
          >
            <Grid.Item gridArea="main">
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
                <Box mb={4}>
                  <ProgressBar progress={totalUsdRaisedPercent} />
                </Box>
                <Grid
                  gridTemplateColumns={['', '', '', '1fr minmax(250px, 1fr)']}
                >
                  <Flex alignItems="start">
                    <Box mr={4} mb={4}>
                      <div className="pui-key-value">
                        <div>Start Date</div>
                        {dateFormat(sto.startDate)}
                      </div>
                    </Box>
                    <div className="pui-key-value">
                      <div>End Date</div>
                      {dateFormat(sto.endDate)}
                    </div>
                  </Flex>
                  <Grid.Item>
                    <RaisedAmount
                      title="Total Funds Raised"
                      primaryAmount={raised}
                      primaryUnit="USD"
                      tokenAmount={totalTokensSold}
                      tokenUnit={ticker.toUpperCase()}
                    />
                  </Grid.Item>
                </Grid>
              </div>
            </Grid.Item>
            <Grid.Item gridArea="table">
              <Box mt={4}>
                <TiersTable sto={sto} />
              </Box>
            </Grid.Item>
            <Grid.Item gridArea="countdown">
              {countdownProps != null && (
                <div className="pui-countdown-container">
                  <Countdown
                    deadline={countdownProps.deadline}
                    title={countdownProps.title}
                    buttonTitle={countdownProps.buttonTitle}
                    handleButtonClick={handlePause}
                    isPaused={sto.pauseStatus}
                  />
                </div>
              )}
            </Grid.Item>
          </Grid>
          <Button
            icon="download"
            kind="secondary"
            onClick={handleExportInvestors}
          >
            Export List Of Investors
          </Button>
        </div>
      </div>
    </Page>
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
