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
import { DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE } from '~/constants';

export interface Props {
  dividends: types.DividendEntity[];
  securityTokenSymbol: string;
  checkpointIndex: number;
}

export const DividendListPresenter = ({
  securityTokenSymbol,
  dividends,
  checkpointIndex,
}: Props) => {
  const allDividendsCompleted = dividends.every(dividend => {
    const {
      investors,
      expiry,
      totalWithheld,
      totalWithheldWithdrawn,
    } = dividend;
    const remainingPayments = investors.filter(
      investor => !investor.paymentReceived && !investor.excluded
    ).length;
    const remainingTransactions = Math.ceil(
      remainingPayments / DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE
    );
    const unwithdrawnTaxes = totalWithheld.minus(totalWithheldWithdrawn);
    return (
      expiry <= new Date() ||
      (remainingTransactions === 0 && unwithdrawnTaxes.eq(0))
    );
  });
  const newDividendUrl = !allDividendsCompleted
    ? '#'
    : `/securityTokens/${securityTokenSymbol}/checkpoints/${checkpointIndex}/dividends/new`;
  return (
    <List>
      {dividends.length ? (
        <Fragment>
          {dividends.map(dividend => (
            <li key={dividend.uid}>
              <DividendCard
                dividend={dividend}
                securityTokenSymbol={securityTokenSymbol}
              />
            </li>
          ))}
          <sc.NewDividendButton
            href={newDividendUrl}
            disabled={!allDividendsCompleted}
            variant="ghost"
            iconPosition="top"
          >
            <IconOutlined
              Asset={icons.SvgPlus}
              width={25}
              height={25}
              scale={0.8}
            />
            Add new <br /> dividend <br /> distribution
            <TooltipPrimary>
              You can add a new dividend distribution if the previous
              distribution has been completed/expired.
            </TooltipPrimary>
          </sc.NewDividendButton>
        </Fragment>
      ) : (
        <sc.PlaceholderButton
          href={newDividendUrl}
          variant="ghost"
          iconPosition="top"
        >
          <IconOutlined
            Asset={icons.SvgPlus}
            width={25}
            height={25}
            scale={0.8}
          />
          Add new <br /> dividend <br /> distribution
        </sc.PlaceholderButton>
      )}
    </List>
  );
};
