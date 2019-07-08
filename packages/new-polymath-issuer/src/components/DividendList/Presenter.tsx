import React, { Fragment, FC } from 'react';
import {
  List,
  Flex,
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
  hasDividends: boolean;
  dividends: types.DividendEntity[];
  symbol: string;
  checkpointId: number;
  allDividendsCompleted: boolean;
}

export const DividendListPresenter: FC<Props> = ({
  symbol,
  dividends,
  checkpointId,
  allDividendsCompleted,
  hasDividends,
}) => {
  const NewDividendButton = hasDividends
    ? sc.NewDividendButton
    : sc.PlaceholderButton;

  return (
    <Fragment>
      <Flex height={370} alignSelf="flex-start">
        <span>
          <NewDividendButton
            as={allDividendsCompleted ? ButtonLink : Button}
            disabled={!allDividendsCompleted}
            href={
              allDividendsCompleted
                ? `/securityTokens/${symbol}/checkpoints/${checkpointId}/dividends/new`
                : undefined
            }
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
          </NewDividendButton>
          {!allDividendsCompleted && (
            <TooltipPrimary placement="top-start">
              You can add a new dividend distribution if the previous
              distribution has been completed/expired.
            </TooltipPrimary>
          )}
        </span>
      </Flex>
      <List
        vertical
        width="100%"
        gridTemplateColumns="repeat(auto-fill, 300px)"
      >
        {dividends.map(dividend => (
          <li key={dividend.uid}>
            <DividendCard
              dividend={dividend}
              checkpointId={checkpointId}
              symbol={symbol}
            />
          </li>
        ))}
      </List>
    </Fragment>
  );
};
