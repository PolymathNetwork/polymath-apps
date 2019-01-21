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
import { SvgClose } from '~/images/icons/Close';
import { SvgCheckmark } from '~/images/icons/Checkmark';
import { SvgPending } from '~/images/icons/Pending';

import * as sc from './styles';

const { TransactionStatus } = types;

interface TransactionItemProps {
  transaction: types.TransactionEntity;
}

const getIcon = (transaction: types.TransactionEntity) => {
  if (
    transaction.status === TransactionStatus.Rejected ||
    transaction.status === TransactionStatus.Failed
  ) {
    return <Icon Asset={SvgClose} color="alert" width={32} height={32} />;
  }

  if (transaction.status === TransactionStatus.Unapproved) {
    return <Icon Asset={SvgPending} color="inactive" width={32} height={24} />;
  }

  if (transaction.status === TransactionStatus.Running) {
    return <Loading small />;
  }

  if (status === TransactionStatus.Succeeded) {
    return <Icon Asset={SvgCheckmark} color="success" width={32} height={24} />;
  }

  return <Icon Asset={SvgPending} color="inactive" width={32} height={24} />;
};

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { description, tag, txHash } = transaction;

  return (
    <sc.Wrapper
      alignItems="flex-start"
      isDisabled={transaction.status === TransactionStatus.Idle}
    >
      <Box minWidth={50} mt={1}>
        {getIcon(transaction)}
      </Box>
      <sc.Info>
        <Heading as="h3" variant="h3" lineHeight="tight" mb="s">
          {description || tag}
        </Heading>
        <CardPrimary>
          <Paragraph as={Flex} fontSize={0}>
            <sc.Label>Transaction details on Etherscan: </sc.Label>
            &nbsp;
            {txHash && (
              <Link href={utils.toEtherscanUrl(txHash)}>
                <TextEllipsis size={28}>{txHash}</TextEllipsis>
              </Link>
            )}
          </Paragraph>
        </CardPrimary>
      </sc.Info>
    </sc.Wrapper>
  );
};
