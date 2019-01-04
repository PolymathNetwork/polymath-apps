import React from 'react';

import { types } from '@polymathnetwork/new-shared';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import { Loading } from '~/components/Loading';
import { Heading } from '~/components/Heading';
import { CardPrimary } from '~/components/CardPrimary';
import { Paragraph } from '~/components/Paragraph';
import { SvgClose } from '~/images/icons/Close.svg';
import { SvgCheckmark } from '~/images/icons/Checkmark.svg';

import * as scc from '../styles';

const { TransactionStatus } = types;

interface ItemTxProps {
  transaction: types.Transaction;
}

const getIcon = (transaction: types.Transaction) => {
  if (transaction.status === TransactionStatus.Rejected) {
    return <Icon Asset={SvgClose} fill="#E71D32" width="32" height="32" />;
  }

  if (transaction.status === TransactionStatus.Unapproved) {
    return <Loading small />;
  }

  if (transaction.status === TransactionStatus.Succeeded) {
    return <Icon Asset={SvgCheckmark} color="success" width="32" height="24" />;
  }
};

export const ItemTx = ({ transaction }: ItemTxProps) => (
  <sc.Wrapper isDisabled={transaction.status === TransactionStatus.Idle}>
    <Box minWidth={50} mt={1}>
      {getIcon(transaction)}
    </Box>
    <sc.TxInfo>
      <Heading as="h3" variant="h3" fontSize={0} lineHeight="tight" mb={1}>
        {transaction.type}
      </Heading>
      <CardPrimary>
        <Paragraph fontSize={0}>
          Transaction details on Etherscan: {transaction.hash}
        </Paragraph>
      </CardPrimary>
    </sc.TxInfo>
  </sc.Wrapper>
);
