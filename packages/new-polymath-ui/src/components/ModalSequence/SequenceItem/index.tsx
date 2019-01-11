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

interface SequenceItemProps {
  transaction: types.TransactionEntity;
}

const getIcon = (transaction: types.TransactionEntity) => {
  const { status } = transaction;
  if (status === TransactionStatus.Rejected) {
    return <Icon Asset={SvgClose} fill="#E71D32" width="32" height="32" />;
  }
  if (status === TransactionStatus.Unapproved) {
    return <Icon Asset={SvgPending} color="#DFE3E6" width="32" height="24" />;
  }
  if (status === TransactionStatus.Running) {
    return <Loading small />;
  }

  if (status === TransactionStatus.Succeeded) {
    return <Icon Asset={SvgCheckmark} color="success" width="32" height="24" />;
  }

  return <Icon Asset={SvgPending} color="#DFE3E6" width="32" height="24" />;
};

export const SequenceItem = ({
  transaction: { status, tag, txHash },
  transaction,
}: SequenceItemProps) => (
  <sc.Wrapper isDisabled={status === TransactionStatus.Idle}>
    <Box minWidth={50} mt={1}>
      {getIcon(transaction)}
    </Box>
    <sc.Info>
      <Heading as="h3" variant="h3" fontSize={0} lineHeight="tight" mb={1}>
        {tag}
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
