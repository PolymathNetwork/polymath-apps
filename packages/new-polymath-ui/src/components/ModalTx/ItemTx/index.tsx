import React from 'react';
import { types } from '@polymathnetwork/new-shared';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import { Loading } from '~/components/Loading';
import { Heading } from '~/components/Heading';
import { CardPrimary } from '~/components/CardPrimary';
import { Paragraph } from '~/components/Paragraph';

import * as S from '../styles';

const { TransactionStatus } = types;

interface ItemTxProps {
  transaction: types.Transaction;
  isActive: boolean;
}

export const ItemTx = ({ transaction, isActive }: ItemTxProps) => (
  <S.Wrapper alignItems="top" isActive={isActive}>
    <Box mr={3}>
      {isActive ? (
        transaction.status === TransactionStatus.Rejected ? (
          <Icon name="close" fill="#E71D32" width="32" height="32" />
        ) : (
          <Loading small />
        )
      ) : transaction.status === TransactionStatus.Succeeded ? (
        <Icon name="checkmark" fill="#00AA5E" width="32" height="24" />
      ) : (
        ''
      )}
    </Box>
    <S.TxInfo>
      <Heading as="h3" variant="h3" fontSize={0} mb={0}>
        {transaction.type}
      </Heading>
      <CardPrimary>
        <Paragraph fontSize={0}>
          Transaction details on Etherscan: {transaction.hash}
        </Paragraph>
      </CardPrimary>
    </S.TxInfo>
  </S.Wrapper>
);
