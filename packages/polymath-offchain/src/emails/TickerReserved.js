// @flow

import React from 'react';

import { POLYMATH_ISSUER_URL, POLYMATH_OFFCHAIN_URL } from '../constants';
import { EmailWrapper, EtherscanURL } from './EmailWrapper';
import { composeURL } from '@polymathnetwork/shared/utils';

type Props = {|
  txHash: string,
  ticker: string,
  expiryLimit: number,
  networkId: string,
|};

export const TickerReserved = ({
  txHash,
  ticker,
  expiryLimit,
  networkId,
}: Props) => {
  return (
    <EmailWrapper>
      <h4>Congratulations!</h4>
      <h1>
        You Have Successfully Reserved the Token Symbol {ticker.toUpperCase()}
      </h1>
      <div className="icon-text tx-hash">
        <div className="icon">
          <img
            alt="Icon"
            src={composeURL(POLYMATH_OFFCHAIN_URL, '/img/checkmark.png')}
          />
        </div>
        <h2>You can view the transaction details here:</h2>
        <div className="tx">
          Transaction details on Etherscan:{' '}
          <EtherscanURL type={'tx'} hash={txHash} networkId={networkId} />
        </div>
      </div>
      <div className="icon-text" style={{ height: '78px' }}>
        <div className="icon">
          <img
            alt="Icon"
            src={composeURL(POLYMATH_OFFCHAIN_URL, '/img/warning.png')}
          />
        </div>
        <h2>
          Your reservation is valid for <strong>{expiryLimit}</strong> days.
          <br />
          If the reservation period lapses before your security token is
          created, the ticker will become available for others.
        </h2>
      </div>
      <div className="text">
        <h3>Before you create your token, you will need to decide whether:</h3>
        <ul>
          <li>your token will be divisible or indivisible;</li>
          <li>
            additional information should be embedded into your token, such as a
            legend or link to your investor relations site.
          </li>
        </ul>
        <p>
          If you are unsure of the above, please consult with your advisors or
          engage an advisory firm through the Polymath Token Studio marketplace
          before your reservation period expires.
        </p>
        <p align="center">
          <a
            href={composeURL(
              POLYMATH_ISSUER_URL,
              `/dashboard/${ticker}/providers`
            )}
          >
            <strong>Click here to continue with your Token Creation</strong>
          </a>
        </p>
      </div>
    </EmailWrapper>
  );
};
