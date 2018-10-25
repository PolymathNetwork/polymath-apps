// @flow

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import { map, reduce } from 'lodash';
import {
  InlineFlex,
  Box,
  ProgressBar,
  SimpleTable,
  Countdown,
  etherscanAddress,
} from '@polymathnetwork/ui';
import { Button } from 'carbon-components-react';
import {
  togglePauseSto,
  exportInvestorsList,
} from '../../../../../actions/sto';

import type { BigNumber as BigNumberType } from 'bignumber.js';
import type { STOPurchase, STODetails } from '@polymathnetwork/js/types';
import type { CountdownProps } from '@polymathnetwork/ui';
import type { RootState } from '../../../../../redux/reducer';
import type { SecurityToken, USDTieredSTO } from '../../../../../constants';

type ComponentProps = {|
  token: SecurityToken,
  handlePause: () => void,
  handleExport: () => void,
  sto: USDTieredSTO,
|};

type StateProps = {|
  sto: USDTieredSTO,
  token: SecurityToken,
|};
type ContainerProps = StateProps;

const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} = SimpleTable;

// FIXME @RafaelVidaurre: etherscanAddress should be a component

// FIXME @RafaelVidaurre: review these
const niceAmount = (poly: BigNumberType) => {
  console.log(poly);
  return poly
    .decimalPlaces(2)
    .toNumber()
    .toLocaleString();
};

const dateFormat = (date: Date) =>
  date.toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const getCountdownProps = (
  startDate: Date,
  endDate: Date,
  isStoPaused: boolean
): ?CountdownProps => {
  const now = new Date();
  if (now < startDate) {
    return {
      deadline: startDate,
      title: 'Time Left Until the Offering Starts',
      isPaused: isStoPaused,
    };
  } else if (now < endDate) {
    return {
      deadline: endDate,
      title: 'Time Left Until the Offering Ends',
      isPaused: isStoPaused,
    };
  }
  return null;
};

const tableHeaders = [
  {
    key: 'tier',
    header: '# Tier',
  },
  {
    key: 'rate',
    header: 'Token Price',
  },
  {
    key: 'totalUsd',
    header: 'Total Raise Target',
  },
  {
    key: 'usdRaised',
    header: 'Raised',
  },
  {
    key: 'progress',
    header: 'Progress',
  },
];

// FIXME RafaelVidaurre

const USDTieredSTOOverviewComponent = ({
  token,
  handlePause,
  handleExport,
  sto,
}: ComponentProps) => {
  console.log(sto);
  // Revisit
  const totalUsdRaised = sto.totalUsdRaised;
  const countdownProps = getCountdownProps(
    sto.startDate,
    sto.endDate,
    sto.paused
  );

  const totalUsdCap = reduce(
    sto.tiers,
    (total, { totalUsd }) => totalUsd + total,
    0
  );

  const totalUsdRaisedPercent = (totalUsdRaised / totalUsdCap) * 100;
  const totalUsdRaisedText = totalUsdRaisedPercent.toFixed(1);

  // TODO: Revisit
  // const symbol = sto.isPolyFundraise ? 'POLY' : 'ETH';
  // const symbol = 'POLY';
  // const raisedText = `${niceAmount(sto.raised)} ${symbol}`;
  // const capText = `${niceAmount(sto.cap)} USD`;
  // const distTokens = `${niceAmount(sto.raised.times(sto.rate))}`;

  const ticker = token.ticker.toUpperCase();

  const raised = sto.totalUsdRaised;
  const tokensSold = reduce(
    sto.tiers,
    (total, { tokensSold }) => tokensSold,
    0
  );

  // const tableRowsHardcoded = [
  //   {
  //     id: 'a',
  //     tier: 1,
  //     tokenPrice: 100,
  //     raiseTarget: 300000,
  //     raised: 100,
  //     progress: (
  //       <InlineFlex>
  //         <Box width="150px" mr={1}>
  //           <ProgressBar progress={0.5} />
  //         </Box>
  //         100%
  //       </InlineFlex>
  //     ),
  //   },
  // ];

  const tiersTableRows = map(
    sto.tiers,
    ({ rate, usdRaised, totalUsd, tokensSold, totalTokens }, tierNumber) => ({
      id: tierNumber,
      tier: tierNumber,
      rate,
      usdRaised,
      totalUsd,
      progress: (
        <InlineFlex>
          <Box width="150px" mr={1}>
            <ProgressBar progress={tokensSold.div(totalTokens).toNumber()} />
          </Box>
          100%
        </InlineFlex>
      ),
    })
  );

  console.log(tiersTableRows);

  return (
    <DocumentTitle title={`${ticker} STO Overview – Polymath`}>
      <div>
        <h1 className="pui-h1">Security Token Overview</h1>
        <br />
        <div className="pui-page-box">
          <h2 className="pui-h2">USD Tiered STO</h2>
          <p className="pui-sto-status-contract">
            Contract {etherscanAddress(sto.factoryAddress)}
          </p>
          <div
            className={
              'pui-sto-status-grow' + (sto.paused ? ' pui-paused' : '')
            }
          >
            <div className="pui-sto-status-numbers">
              <div>{totalUsdRaisedText}%</div>
              <div className="pui-key-value">
                <div>Cap</div>
                {totalUsdCap} USD
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
                  {dateFormat(sto.startDate)}
                </div>
                <div className="pui-key-value">
                  <div>
                    {/* 1 {symbol}{' '} */}
                    <span>{/* = {sto.rate} {ticker} */}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="pui-key-value pui-countdown-raised">
                  <div>Total Funds Raised</div>
                  {`${raised} USD`}
                  <div>
                    {tokensSold.toString()} {ticker}
                  </div>
                </div>
              </div>
            </div>
            <Box mt={4}>
              <SimpleTable
                rows={tiersTableRows}
                headers={tableHeaders}
                render={({ rows, headers }) => {
                  return (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {headers.map(header => (
                              <TableHeader>{header.header}</TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map(row => (
                            <TableRow key={row.id}>
                              {row.cells.map(cell => (
                                <TableCell key={cell.id}>
                                  {cell.value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  );
                }}
              />
            </Box>
            <Button icon="download" kind="secondary" onClick={handleExport}>
              Export List Of Investors
            </Button>
          </div>
          {countdownProps != null && (
            <div className="pui-countdown-container">
              <Countdown
                deadline={countdownProps.deadline}
                title={countdownProps.title}
                buttonTitle={sto.paused ? 'RESUME STO' : 'PAUSE STO'}
                handleButtonClick={handlePause}
                isPaused={sto.paused}
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
    console.log('pausing');
  };
  // NOTE @RafaelVidaurre: Export what? Add specificity
  export = () => {
    console.log('exporting');
  };

  render() {
    const { sto, token } = this.props;

    return (
      <USDTieredSTOOverviewComponent
        token={token}
        sto={sto}
        handleExport={this.export}
        handlePause={this.pause}
      />
    );
  }
}

export default connect(mapStateToProps)(USDTieredSTOOverviewContainer);
