// @flow

import React from 'react';
import moment from 'moment';

import { EmailWrapper, EtherscanURL } from './EmailWrapper';
import { POLYMATH_ISSUER_URL, POLYMATH_OFFCHAIN_URL } from '../constants';

type Props = {|
  ticker: string,
  start: Date,
  cap: number,
  rate: number,
  isPolyFundraise: boolean,
  fundsReceiver: string,
  txHash: string,
  networkId: string,
|};

const thousandsDelimiter = (v: number) => {
  let [i, f] = v.toString(10).split('.');
  return (
    i.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (f ? '.' + f : '')
  );
};

export const STOScheduled = ({
  ticker,
  start,
  cap,
  rate,
  isPolyFundraise,
  fundsReceiver,
  txHash,
  networkId,
}: Props) => {
  const capRate = cap / rate;
  const amountOfFunds =
    isNaN(capRate) || capRate === Infinity ? '0' : thousandsDelimiter(capRate);

  return (
    <EmailWrapper>
      <h4>Congratulations!</h4>
      <h1>
        You Have Successfully Created and Scheduled the Security Token Offering
        for {ticker.toUpperCase()}
      </h1>
      <div className="icon-text tx-hash">
        <div className="icon">
          <img alt="Icon" src={`${POLYMATH_OFFCHAIN_URL}/img/checkmark.png`} />
        </div>
        <h2>You can view the transaction details here:</h2>
        <div className="tx">
          Transaction details on Etherscan:{' '}
          <EtherscanURL type={'tx'} hash={txHash} networkId={networkId} />
        </div>
      </div>
      <div className="text">
        <h3>Additional details of your Security Token Offering are below:</h3>
        <div className="value">
          <strong>Scheduled start</strong>
          <p>{moment(start).format('MM/DD/YYYY')}</p>
        </div>
        <div className="value">
          <strong>
            ETH Address to receive the funds raised during the STO
          </strong>
          <p>
            <EtherscanURL
              type={'address'}
              hash={fundsReceiver}
              networkId={networkId}
            />
          </p>
        </div>
        <div className="value">
          <strong>Rate</strong>
          <p>
            {thousandsDelimiter(rate)} {ticker.toUpperCase()}
            /1 {isPolyFundraise ? 'POLY' : 'ETH'}
          </p>
        </div>
        <div className="value">
          <strong>Hardcap (in Tokens)</strong>
          <p>{thousandsDelimiter(cap)}</p>
        </div>
        <div className="value">
          <strong>Amount of Funds the STO Will Raise</strong>
          <p>
            {amountOfFunds} {isPolyFundraise ? 'POLY' : 'ETH'}
          </p>
        </div>
        <p align="center">
          <a href={`${POLYMATH_ISSUER_URL}/dasbhoard/${ticker}/sto`}>
            <strong>
              Click here to access your Security Offering Dashboard
            </strong>
          </a>
        </p>
      </div>
    </EmailWrapper>
  );
};
