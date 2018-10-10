// @flow

import React from 'react';

import { EmailWrapper, EtherscanURL } from './EmailWrapper';
import { POLYMATH_ISSUER_URL, POLYMATH_OFFCHAIN_URL } from '../constants';

type Props = {|
  ticker: string,
  txHash: string,
  networkId: string,
|};

// TODO @monitz87: check component and refactor if needed

export const TokenCreated = ({ txHash, ticker, networkId }: Props) => {
  return (
    <EmailWrapper>
      <h4>Congratulations!</h4>
      <h1>You Have Successfully Created the {ticker.toUpperCase()} Token</h1>
      <div className="icon-text tx-hash">
        <div className="icon">
          <img alt="Icon" src={`${POLYMATH_OFFCHAIN_URL}/img/checkmark.png`} />
        </div>
        <h2>You can view the transaction details here:</h2>
        <div className="tx">
          Transaction details on Etherscan:{' '}
          <EtherscanURL hash={txHash} type={'tx'} networkId={networkId} />
        </div>
      </div>
      <div className="text">
        <h3>
          Now that your security token is created, you can proceed to the next
          steps:
        </h3>
        <ol>
          <li>
            Mint tokens to existing shareholders and your reserve, or for
            investors that may have participated in a SAFT or pre-sale
            (optional).
          </li>
          <li>
            Whitelist investors after their suitability has been assessed.
            Investors can be added to or removed from the whitelist before,
            during and after the STO, allowing you to continuously add to your
            investor pool. Note that only investors whose ether addresses are
            included in the whitelist can participate into the STO or receive
            tokens.
          </li>
          <li>
            Select a security token offering template and configure the
            specifics of your security token offering.
          </li>
        </ol>
        <p align="center">
          <a href={`${POLYMATH_ISSUER_URL}/dashboard/${ticker}`}>
            <strong>Click here to proceed with your Token Minting</strong>
          </a>
        </p>
      </div>
    </EmailWrapper>
  );
};
