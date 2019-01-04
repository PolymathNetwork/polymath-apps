import React from 'react';
import { Label } from './Label';
import { ReactComponent as SvgEth } from '~/images/icons/eth.svg';
import { ReactComponent as SvgPolyB } from '~/images/icons/poly-b.svg';
import { ReactComponent as SvgDai } from '~/images/icons/dai.svg';

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
