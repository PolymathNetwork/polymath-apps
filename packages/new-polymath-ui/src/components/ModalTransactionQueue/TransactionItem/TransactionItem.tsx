import React, { FC } from 'react';
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
import { getTransactionTitle } from '~/components/utils/contentMappings';

const { TransactionStatus } = types;

interface TransactionItemProps {
  transaction: types.TransactionPojo;
  getTitle: (transaction: types.TransactionPojo) => string;
}

const getIcon = (transaction: types.TransactionPojo) => {
  const { status } = transaction;

  if (
    status === TransactionStatus.Rejected ||
    status === TransactionStatus.Failed
  ) {
    return <Icon Asset={SvgClose} color="alert" width={32} height={32} />;
  }

  if (status === TransactionStatus.Unapproved) {
    return <Icon Asset={SvgPending} color="gray.1" width={32} height={24} />;
  }

  if (status === TransactionStatus.Running) {
    return <Loading small />;
  }

  if (status === TransactionStatus.Succeeded) {
    return <Icon Asset={SvgCheckmark} color="success" width={32} height={24} />;
  }

  return null;
};

interface StaticProps {
  defaultProps: { getTitle: TransactionItemProps['getTitle'] };
}

const TransactionItem: FC<TransactionItemProps> & StaticProps = ({
  transaction,
  getTitle,
}) => {
  const title = getTitle(transaction);
  const { txHash } = transaction;

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
          {title}
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

TransactionItem.defaultProps = {
  getTitle: getTransactionTitle,
};

export { TransactionItem };
