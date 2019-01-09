import React from 'react';

import { types, utils } from '@polymathnetwork/new-shared';

import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import { Loading } from '~/components/Loading';
import { Heading } from '~/components/Heading';
import { CardPrimary } from '~/components/CardPrimary';
import { Paragraph } from '~/components/Paragraph';
import { Flex } from '~/components/Flex';
import { TextEllipsis } from '~/components/TextEllipsis';
import { Link } from '~/components/Link';
import SvgClose from '~/images/icons/close.svg';
import SvgCheckmark from '~/images/icons/checkmark.svg';
import SvgPending from '~/images/icons/pending.svg';

import * as sc from './styles';

const { TransactionStatus } = types;

interface SequenceItemProps {
  transaction: types.Transaction;
}

const getIcon = (transaction: types.Transaction) => {
  console.log(transaction.status);
  if (transaction.status === TransactionStatus.Rejected) {
    return <Icon Asset={SvgClose} fill="#E71D32" width="32" height="32" />;
  }
  if (
    transaction.status === TransactionStatus.Unapproved ||
    transaction.status === TransactionStatus.Approved
  ) {
    console.log('here');
    return <Loading small />;
  }

  if (transaction.status === TransactionStatus.Succeeded) {
    return <Icon Asset={SvgCheckmark} color="success" width="32" height="24" />;
  }

  return <Icon Asset={SvgPending} color="#DFE3E6" width="32" height="24" />;
};

export const SequenceItem = ({ transaction }: SequenceItemProps) => (
  <sc.Wrapper isDisabled={transaction.status === TransactionStatus.Idle}>
    <Box minWidth={50} mt={1}>
      {getIcon(transaction)}
    </Box>
    <sc.Info>
      <Heading as="h3" variant="h3" fontSize={0} lineHeight="tight" mb={1}>
        {transaction.type}
      </Heading>
      <CardPrimary>
        <Paragraph as={Flex} fontSize={0}>
          <sc.Label>Transaction details on Etherscan: </sc.Label>
          &nbsp;
          {transaction.hash && (
            <Link href={utils.toEtherscanUrl(transaction.hash)}>
              <TextEllipsis size={28}>{transaction.hash}</TextEllipsis>
            </Link>
          )}
        </Paragraph>
      </CardPrimary>
    </sc.Info>
  </sc.Wrapper>
);
