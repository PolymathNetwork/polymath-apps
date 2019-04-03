import React, { Fragment, FC } from 'react';
import {
  List,
  ButtonLink,
  Button,
  icons,
  IconOutlined,
  TooltipPrimary,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import { DividendCard } from '~/components/DividendCard';
import * as sc from './styles';

export interface Props {
  dividends: types.DividendEntity[];
  securityTokenSymbol: string;
  checkpointIndex: number;
  allDividendsCompleted: boolean;
}

export const DividendListPresenter: FC<Props> = ({
  securityTokenSymbol,
  dividends,
  checkpointIndex,
  allDividendsCompleted,
}) => {
  const newDividendUrl = !allDividendsCompleted
    ? '#'
    : `/securityTokens/${securityTokenSymbol}/checkpoints/${checkpointIndex}/dividends/new`;
  return (
    <List horizontal>
      {dividends.length ? (
        <Fragment>
          {dividends.map(dividend => (
            <li key={dividend.uid}>
              <DividendCard
                dividend={dividend}
                checkpointIndex={checkpointIndex}
                securityTokenSymbol={securityTokenSymbol}
              />
            </li>
          ))}
          <span>
            <sc.NewDividendButton
              as={allDividendsCompleted ? ButtonLink : Button}
              disabled={!allDividendsCompleted}
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
            </sc.NewDividendButton>
            {!allDividendsCompleted && (
              <TooltipPrimary placement="top-start">
                You can add a new dividend distribution if the previous
                distribution has been completed/expired.
              </TooltipPrimary>
            )}
          </span>
        </Fragment>
      ) : (
        <span>
          <sc.PlaceholderButton
            as={allDividendsCompleted ? ButtonLink : Button}
            href={newDividendUrl}
            variant="ghost"
            iconPosition="top"
            disabled={!allDividendsCompleted}
          >
            <IconOutlined
              Asset={icons.SvgPlus}
              width={25}
              height={25}
              scale={0.8}
            />
            Add new <br /> dividend <br /> distribution
          </sc.PlaceholderButton>
          {!allDividendsCompleted && (
            <TooltipPrimary placement="top-start">
              You can add a new dividend distribution if the previous
              distribution has been completed/expired.
            </TooltipPrimary>
          )}
        </span>
      )}
    </List>
  );
};
