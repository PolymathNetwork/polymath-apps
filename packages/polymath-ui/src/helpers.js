// @flow

import React from 'react';
import { BigNumber } from 'bignumber.js';
import type { Node } from 'react';

let network = '';

export const setHelpersNetwork = (name: string) => {
  if (!name) {
    return;
  }
  network = name.split(' ')[0].toLowerCase();
  if (network === 'mainnet') {
    network = '';
  }
};

const etherscan = (type: string, value: string, label: Node) => {
  return (
    <a
      href={`https://${
        network ? network + '.' : ''
      }etherscan.io/${type}/${value}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
};

export const etherscanAddress = (address: string, label?: Node) => {
  return etherscan('address', address, label || address);
};

export const etherscanTx = (hash: string) => {
  return etherscan('tx', hash, hashShortifier(hash));
};

export const etherscanToken = (address: string, label?: Node) => {
  return etherscan('token', address, label || address);
};

export const thousandsDelimiter = (v: number) => {
  let [i, f] = v.toString(10).split('.');
  return (
    i.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    (f ? '.' + f : '')
  );
};

export const addressShortifier = (address: string) =>
  address.substring(0, 7) + '...' + address.slice(-7);

export const hashShortifier = (hash: string) =>
  hash.substring(0, 10) + '...' + hash.slice(-4);

export const timeZoneName = (): ?string => {
  const dateString = new Date().toLocaleDateString('en', {
    timeZoneName: 'long',
  });
  const comma = dateString.indexOf(', ');
  if (comma === -1) {
    return null;
  }

  return dateString.substring(comma + 2);
};

export const trim = (value: string) => value && value.trim();
