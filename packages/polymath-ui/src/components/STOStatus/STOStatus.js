// @flow

import BigNumber from 'bignumber.js';
import React, { Component } from 'react';
import { Icon } from 'carbon-components-react';
import type { SecurityToken, STODetails } from '@polymathnetwork/js/types';

import { etherscanAddress } from '../../helpers';
import Box from '../Box';
import Grid from '../Grid';
import Countdown from '../Countdown';
import ContentBox from '../ContentBox';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import ProgressBar from '../ProgressBar';
import RaisedAmount from '../RaisedAmount';

import type { CountdownProps } from '../Countdown';

import './style.scss';

type Props = {|
  token: SecurityToken,
  details: STODetails,
  isStoPaused: boolean,
  toggleStoPause?: () => any,
  notPausable?: boolean,
|};

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

export default class STOStatus extends Component<Props> {
  state = {
    countdownProps: {},
  };

  getCountdownProps = (
    startDate: Date,
    endDate: Date,
    isStoPaused: boolean
  ): ?CountdownProps => {
    const now = new Date();
    if (now < startDate) {
      const timeUntilStart = startDate - now;

      setTimeout(() => {
        this.setState({
          countdownProps: this.getCountdownProps(
            startDate,
            endDate,
            this.props.isStoPaused
          ),
        });
      }, timeUntilStart);

      return {
        deadline: startDate,
        title: 'Time Left Until the Offering Starts',
        isPaused: isStoPaused,
      };
    } else if (now < endDate) {
      const timeUntilEnd = endDate - now;

      setTimeout(() => {
        this.setState({
          countdownProps: this.getCountdownProps(
            startDate,
            endDate,
            this.props.isStoPaused
          ),
        });
      }, timeUntilEnd);

      return {
        deadline: endDate,
        title: 'Time Left Until the Offering Ends',
        isPaused: isStoPaused,
      };
    }

    return null;
  };

  componentWillMount() {
    const { details } = this.props;

    this.setState({
      countdownProps: this.getCountdownProps(
        details.start,
        details.end,
        this.props.isStoPaused
      ),
    });
  }

  render() {
    const { token, details, notPausable } = this.props;
    const { countdownProps } = this.state;

    const symbol = details.isPolyFundraise ? 'POLY' : 'ETH';

    const raisedText = `${niceAmount(details.raised)} ${symbol}`;
    const capText = `${niceAmount(details.cap)} ${token.ticker}`;

    const distTokens = niceAmount(details.raised.times(details.rate));

    const fractionComplete = details.raised
      .div(details.cap.div(details.rate))
      .times(100)
      .toFixed(1);

    const isSaleComplete = parseInt(fractionComplete, 10) === 100;

    return (
      <div className="pui-page-box">
        <h2 className="pui-h2">Capped STO</h2>
        <p className="pui-sto-status-contract">
          Contract {etherscanAddress(details.address)}
        </p>
        <Grid gridTemplateColumns={['', '', '', '1fr minmax(250px, 1fr)']}>
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
            <Box mb="l">
              <ProgressBar progress={fractionComplete} />
            </Box>
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
                <RaisedAmount
                  title="Total Funds Raised"
                  primaryAmount={details.raised}
                  primaryUnit={symbol}
                  tokenAmount={distTokens}
                  tokenUnit={token.ticker.toUpperCase()}
                />
              </div>
            </div>
          </div>
          {isSaleComplete ? (
            <div className="pui-countdown-container">
              <ContentBox
                style={{
                  borderRadius: '10px',
                  borderTop: '15px solid #00AA5E',
                  width: '350px',
                }}
              >
                <Paragraph textAlign="center">
                  <Icon
                    name="checkmark--outline"
                    fill="#00AA5E"
                    width="64"
                    height="64"
                  />
                </Paragraph>
                <Heading variant="h2" textAlign="center">
                  The Sale is Complete
                </Heading>
              </ContentBox>
            </div>
          ) : countdownProps != null ? (
            <div className="pui-countdown-container">
              <Countdown
                deadline={countdownProps.deadline}
                title={countdownProps.title}
                buttonTitle={
                  notPausable
                    ? undefined
                    : this.props.isStoPaused
                    ? 'RESUME STO'
                    : 'PAUSE STO'
                }
                handleButtonClick={this.props.toggleStoPause}
                isPaused={this.props.isStoPaused}
                pausable={!notPausable}
              />
            </div>
          ) : (
            <div className="pui-countdown-container">
              <ContentBox
                style={{
                  borderRadius: '10px',
                  borderTop: '15px solid #00AA5E',
                  width: '350px',
                }}
              >
                <Paragraph textAlign="center">
                  <Icon
                    name="checkmark--outline"
                    fill="#00AA5E"
                    width="64"
                    height="64"
                  />
                </Paragraph>
                <Heading variant="h3" textAlign="center">
                  The Sale is Closed
                </Heading>
              </ContentBox>
            </div>
          )}
        </Grid>
      </div>
    );
  }
}
