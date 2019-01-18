import React from 'react';
import { Box } from '~/components/Box';
import { IconCircled } from '~/components/IconCircled';
import { Heading } from '~/components/Heading';
import { CardPrimary } from '~/components/CardPrimary';
import { Paragraph } from '~/components/Paragraph';

import * as sc from './styles';

interface TransactionItemProps {
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
  title: React.ComponentType | string;
  description: React.ComponentType | string;
}

export const TransactionItem = ({
  Asset,
  title,
  description,
}: TransactionItemProps) => (
  <sc.Wrapper alignItems="flex-start">
    <Box minWidth={50} mt={1}>
      <IconCircled
        Asset={Asset}
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
