import React, { Fragment } from 'react';
import {
  List,
  icons,
  IconOutlined,
  TooltipPrimary,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import { DividendCard } from '~/components/DividendCard';
import * as sc from './styles';

export interface Props {
  dividends: types.DividendPojo[];
  symbol: string;
}

export const Presenter = ({ symbol, dividends }: Props) => (
  <List>
    {dividends.length ? (
      <Fragment>
        {dividends.map(dividend => (
          <li key={dividend.uid}>
            <DividendCard dividend={dividend} symbol={symbol} />
          </li>
        ))}
        <sc.NewDividendButton variant="ghost" iconPosition="top">
          <IconOutlined
            Asset={icons.SvgPlus}
            width={25}
            height={25}
            scale={0.9}
          />
          Add new <br /> dividend <br /> distribution
          <TooltipPrimary>
            You can add new dividend distribution if previous dividend has been
            completed/expired.
          </TooltipPrimary>
        </sc.NewDividendButton>
      </Fragment>
    ) : (
      <sc.PlaceholderButton variant="ghost" iconPosition="top">
        <IconOutlined
          Asset={icons.SvgPlus}
          width={25}
          height={25}
          scale={0.9}
        />
        Add new <br /> dividend <br /> distribution
      </sc.PlaceholderButton>
    )}
  </List>
);
