import React from 'react';
import { ReactComponent as SvgEth } from '~/images/icons/eth.svg';
import { ReactComponent as SvgPolyB } from '~/images/icons/poly-b.svg';
import { ReactComponent as SvgDai } from '~/images/icons/dai.svg';
import { Label } from './Label';

export const currencyOptions = [
  {
    value: 'ETH',
    label: <Label text="Ethereum (ETH)" Asset={SvgEth} />,
  },
  {
    value: 'POLY',
    label: <Label text="Polymath (POLY)" Asset={SvgPolyB} />,
  },
  {
    value: 'DAI',
    label: <Label text="Dai (DAI)" Asset={SvgDai} />,
  },
];
