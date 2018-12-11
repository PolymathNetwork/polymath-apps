import React from 'react';

import { Label } from './Label';

import EthIcon from '../../../images/icons/Eth';
import PolyIcon from '../../../images/icons/Poly2';
import DaiIcon from '../../../images/icons/Dai';

export const currencyOptions = [
  {
    value: 'ETH',
    label: <Label text="Ethereum (ETH)" Asset={EthIcon} />,
  },
  {
    value: 'POLY',
    label: <Label text="Polymath (POLY)" Asset={PolyIcon} />,
  },
  {
    value: 'DAI',
    label: <Label text="Dai (DAI)" Asset={DaiIcon} />,
  },
];
