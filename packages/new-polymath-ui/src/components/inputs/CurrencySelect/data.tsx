import React from 'react';

import { Label } from './Label';

import { SvgEth } from '../../../images/icons/Eth';
import { SvgPoly } from '../../../images/icons/Poly';
import { SvgDai } from '../../../images/icons/Dai';

export const currencyOptions = [
  {
    value: 'ETH',
    label: <Label text="Ethereum (ETH)" Asset={SvgEth} id="eth" />,
  },
  {
    value: 'POLY',
    label: <Label text="Polymath (POLY)" Asset={SvgPoly} id="poly" />,
  },
  {
    value: 'DAI',
    label: <Label text="Dai (DAI)" Asset={SvgDai} id="dai" />,
  },
];
