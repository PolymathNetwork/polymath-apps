import React from 'react';
import { types } from '@polymathnetwork/new-shared';
import { Box } from '~/components/Box';
import { IconCircled } from '~/components/IconCircled';
import { Heading } from '~/components/Heading';
import { CardPrimary } from '~/components/CardPrimary';
import { Paragraph } from '~/components/Paragraph';
import { getTransactionText } from '~/components/utils/contentMappings';

import * as sc from './styles';

interface TransactionItemProps {
  transaction: types.TransactionEntity;
}

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { title, description, Icon } = getTransactionText(transaction);
  return (
    <sc.Wrapper alignItems="flex-start">
      <Box minWidth={50} mt={1}>
        <IconCircled
          Asset={Icon}
          color="white"
          bg="secondary"
          width={32}
          height={32}
        />
      </Box>
      <sc.Info>
        <Heading as="h3" variant="h3" fontSize={2} lineHeight="tight" mb="s">
          {title}
        </Heading>
        <CardPrimary>
          <Paragraph fontSize={4}>{description}</Paragraph>
        </CardPrimary>
      </sc.Info>
    </sc.Wrapper>
  );
};
