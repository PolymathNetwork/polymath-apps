// @flow

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
  InlineFlex,
  Box,
  ProgressBar,
  SimpleTable,
  NotFoundPage,
  Countdown,
  etherscanAddress,
} from '@polymathnetwork/ui';
import { Button } from 'carbon-components-react';
import type {
  SecurityToken,
  STOPurchase,
  STODetails,
} from '@polymathnetwork/js/types';

import {
  togglePauseSto,
  exportInvestorsList,
} from '../../../../../actions/sto';
import type { RootState } from '../../../../../redux/reducer';
import type { CountdownProps } from '@polymathnetwork/ui';

type StateProps = {|
  token: ?SecurityToken,
  details: ?STODetails,
  purchases: Array<STOPurchase>,
  isStoPaused: boolean,
|};

type DispatchProps = {|
  togglePauseSto: (endDate: Date) => any,
  exportInvestorsList: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  token: state.token.token,
  details: state.sto.details,
  purchases: state.sto.purchases,
  isStoPaused: state.sto.pauseStatus,
});

const mapDispatchToProps: DispatchProps = {
  togglePauseSto,
  exportInvestorsList,
};

type Props = {||} & StateProps & DispatchProps;

const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} = SimpleTable;

const niceAmount = (poly: BigNumber) =>
  poly
    .round(2)
    .toNumber()
    .toLocaleString();

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

class OverviewPegToFiatSTO extends Component<Props> {
  handlePause = () => {
    // $FlowFixMe
    this.props.togglePauseSto();
  };

  handleExport = () => {
    this.props.exportInvestorsList();
  };

  render() {
    const { token, details } = this.props;

    const countdownProps = getCountdownProps(
      details.start,
      details.end,
      this.props.isStoPaused
    );

    const symbol = details.isPolyFundraise ? 'POLY' : 'ETH';

    const raisedText = `${niceAmount(details.raised)} ${symbol}`;
    const capText = `${niceAmount(details.cap)} ${token.ticker}`;

    const distTokens = niceAmount(details.raised.times(details.rate));

    const fractionComplete = details.raised
      .div(details.cap.div(details.rate))
      .times(100)
      .toFixed(1);

    const {
      TableContainer,
      Table,
      TableHead,
      TableHeader,
      TableBody,
      TableRow,
      TableCell,
    } = SimpleTable;

    const headers = [
      {
        // `key` is the name of the field on the row object itself for the header
        key: 'tier',
        // `header` will be the name you want rendered in the Table Header
        header: '# Tier',
      },
      {
        key: 'tokenPrice',
        header: 'Token Price',
      },
      {
        key: 'raiseTarget',
        header: 'Total Raise Target',
      },
      {
        key: 'raised',
        header: 'Raised',
      },
      {
        key: 'progress',
        header: '',
      },
    ];

    const rows = [
      {
        id: 'a',
        tier: 1,
        tokenPrice: 100,
        raiseTarget: 300000,
        raised: 100,
        progress: (
          <InlineFlex>
            <Box width="150px" mr={1}>
              <ProgressBar progress={0.5} />
            </Box>
            100%
          </InlineFlex>
        ),
      },
    ];

    if (!token || !details) {
      return <NotFoundPage />;
    }
    return (
      <DocumentTitle title={`${token.ticker} STO Overview – Polymath`}>
        <div>
          <h1 className="pui-h1">Security Token Overview</h1>
          <br />
          <div className="pui-page-box">
            <h2 className="pui-h2">Capped STO</h2>
            <p className="pui-sto-status-contract">
              Contract {etherscanAddress(details.address)}
            </p>
            <div
              className={
                'pui-sto-status-grow' +
                (this.props.isStoPaused ? ' pui-paused' : '')
              }
            >
              <div className="pui-sto-status-numbers">
                <div>{fractionComplete}%</div>
                <div className="pui-key-value">
                  <div>Cap</div>
                  {capText}
                </div>
              </div>
              <ProgressBar
                className="pui-sto-status-progress-bar"
                progress={fractionComplete / 100}
              />
              <div className="pui-sto-status-bottom-row">
                <div className="pui-sto-status-dates">
                  <div className="pui-key-value">
                    <div>Start Date</div>
                    {dateFormat(details.start)}
                  </div>
                  <div className="pui-key-value">
                    <div>End Date</div>
                    {dateFormat(details.end)}
                  </div>
                  <div className="pui-key-value">
                    <div>
                      1 {symbol}{' '}
                      <span>
                        = {details.rate} {token.ticker}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="pui-key-value pui-countdown-raised">
                    <div>Total Funds Raised</div>
                    {raisedText}
                    <div>
                      {distTokens} {token.ticker}
                    </div>
                  </div>
                </div>
              </div>
              <Box mt={4}>
                <SimpleTable
                  rows={rows}
                  headers={headers}
                  render={({ rows, headers }) => (
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
                  )}
                />
              </Box>
              <Button
                icon="download"
                kind="secondary"
                onClick={this.handleExport}
              >
                Export List Of Investors
              </Button>
            </div>
            {countdownProps != null && (
              <div className="pui-countdown-container">
                <Countdown
                  deadline={countdownProps.deadline}
                  title={countdownProps.title}
                  buttonTitle={
                    this.props.isStoPaused ? 'RESUME STO' : 'PAUSE STO'
                  }
                  handleButtonClick={this.props.handlePause}
                  isPaused={this.props.isStoPaused}
                />
              </div>
            )}
            <div className="pui-clearfix" />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewPegToFiatSTO);
