import React, { FC } from 'react';
import { formatters, types } from '@polymathnetwork/new-shared';
import {
  Box,
  Card,
  Heading,
  ButtonFluid,
  CardPrimary,
  Icon,
  icons,
  Paragraph,
  Text,
  Flex,
  Label,
  theme,
  IconCircled,
} from '@polymathnetwork/new-ui';

interface Props {
  dividend: types.DividendPojo;
  securityTokenSymbol: string;
}

export const DividendCard: FC<Props> = ({ dividend, securityTokenSymbol }) => {
  return (
    <Card width={300} height={370} p="gridGap">
      <Flex flexDirection="column" height="100%" alignItems="flex-start">
        <CardPrimary p={3} width="100%">
          <Flex justifyContent="space-between">
            <Text fontSize={0}>
              <span>Dividend Amount</span>
            </Text>
            <Text fontSize={0} color="gray.2">
              <span>Not completed</span>
              <Icon
                Asset={icons.SvgDot}
                width={16}
                height={16}
                color="warning"
              />
            </Text>
          </Flex>
          <Paragraph fontSize={4} color="baseText" mt="m">
            {formatters.toTokens(dividend.amount)} {securityTokenSymbol}
          </Paragraph>
        </CardPrimary>
        <Heading mt="m" mb={1}>
          {dividend.name}
        </Heading>
        <Label color={theme.tokens[types.Tokens.Erc20].color}>
          Issued in ERC20
        </Label>
        <Flex mt="m">
          <Flex flex="0" mr="s">
            <IconCircled
              Asset={icons.SvgWarning}
              width={26}
              height={26}
              color="white"
              bg="warning"
              scale={0.9}
            />
          </Flex>
          <Paragraph fontSize={0}>
            <strong>2</strong> Remaining transactions
          </Paragraph>
        </Flex>
        <Box mt="auto" minWidth="100%" textAlign="center">
          <ButtonFluid
            href={`/securityTokens/${securityTokenSymbol}/dividends/${
              dividend.index
            }`}
            variant="secondary"
          >
            View details
          </ButtonFluid>
        </Box>
      </Flex>
    </Card>
  );
};
