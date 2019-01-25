// @flow

import React from 'react';
import { POLYMATH_OFFCHAIN_URL, NETWORKS } from '../constants';
import styles from './styles';

import type { Node } from 'react';

type Props = {|
  children: Node,
|};

// TODO @monitz87: check component and refactor if needed (especially the styles part)

export const EmailWrapper = ({ children }: Props) => (
  <html lang="en">
    <head>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </head>
    <body>
      <div className="wrapper">
        <div className="top-bar">
          <img alt="Icon" src={`${POLYMATH_OFFCHAIN_URL}/img/logo.png`} />
        </div>
        <div className="content">
          {children}
          <div className="icon-text" style={{ height: '52px' }}>
            <div className="icon question">
              <img
                alt="Icon"
                src={`${POLYMATH_OFFCHAIN_URL}/img/question.png`}
              />
            </div>
            <h2>
              If you have any questions, please reach out to
              <br />
              <a href="mailto:tokenstudio@polymath.network">
                tokenstudio@polymath.network
              </a>
            </h2>
          </div>
          <h2 className="sincere">
            Best,
            <br />
            Polymath Support
          </h2>
        </div>
        <div className="footer">
          <div className="left">© 2018 Polymath</div>
          <div className="right">
            <a href="https://polymath.network/termsofservice.html">
              Terms of service
            </a>
            <a href="https://polymath.network/privacypolicy.html">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </body>
  </html>
);

export const EtherscanURL = ({
  hash,
  type,
  networkId,
}: {
  hash: string,
  type: string,
  networkId: string,
}) => {
  let label;
  if (type === 'tx') {
    label = hash.substring(0, 10) + '...' + hash.slice(-4);
  } else {
    label = hash;
  }

  const networkName = NETWORKS[networkId].name;

  return (
    <a
      href={`https://${
        networkName !== 'mainnet' ? networkName + '.' : ''
      }etherscan.io/${type}/${hash}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
};
