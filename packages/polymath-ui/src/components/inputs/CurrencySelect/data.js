import React from 'react';

import Label from './Label';

import ethIcon from '../../../images/icons/eth.svg';
import polyIcon from '../../../images/icons/poly-2.svg';
import daiIcon from '../../../images/icons/dai.svg';

export const currencyOptions = [
  {
    value: 'ETH',
    label: <Label text="Ethereum (ETH)" icon={ethIcon} />,
  },
  {
    value: 'POLY',
    label: <Label text="Polymath (POLY)" icon={polyIcon} />,
  },
  {
    value: 'DAI',
    label: <Label text="Dai (DAI)" icon={daiIcon} />,
  },
];
