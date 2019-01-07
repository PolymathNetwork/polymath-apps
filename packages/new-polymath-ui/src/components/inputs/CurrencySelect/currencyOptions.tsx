import React from 'react';
import { ReactComponent as SvgEth } from '~/images/icons/eth.svg';
import { ReactComponent as SvgPoly } from '~/images/icons/poly.svg';
import { ReactComponent as SvgDai } from '~/images/icons/dai.svg';
import { Label } from './Label';

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
