import React from 'react';

import { Label } from './Label';

import { SvgEth } from '../../../images/icons/Eth.svg';
import { SvgPoly2 } from '../../../images/icons/Poly2.svg';
import { SvgDai } from '../../../images/icons/Dai.svg';

export const currencyOptions = [
  {
    value: 'ETH',
    label: <Label text="Ethereum (ETH)" Asset={SvgEth} />,
  },
  {
    value: 'POLY',
    label: <Label text="Polymath (POLY)" Asset={SvgPoly2} />,
  },
  {
    value: 'DAI',
    label: <Label text="Dai (DAI)" Asset={SvgDai} />,
  },
];
