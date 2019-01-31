import React from 'react';
import { formatters } from '@polymathnetwork/new-shared';
import {
  Box,
  List,
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
  Tooltip,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dividends: types.DividendPojo[];
  symbol: string;
}

export const Presenter = ({ symbol, dividends }: Props) => (
  <List>
    {dividends.map(dividend => (
      <li key={dividend.uid}>
        <Card minWidth={300} maxWidth={300} height={370} p="gridGap">
          <Flex flexDirection="column" height="100%" alignItems="flex-start">
            <CardPrimary p={3} width="100%">
              <Flex justifyContent="space-between">
                <Text fontSize={0}>
                  <span>Dividend Amount</span>
                </Text>
                <Text fontSize={0} color="gray.2">
                  <span>Not completed</span>
                  <Icon Asset={icons.SvgDot} size={16} color="warning" />
                </Text>
              </Flex>
              <Paragraph fontSize={4} color="baseText" mt="m">
                {formatters.toTokens(dividend.amount)} {symbol}
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
                  size={26}
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
              <Tooltip
                trigger={
                  <ButtonFluid variant="secondary">View details</ButtonFluid>
                }
              >
                The tooltip content
              </Tooltip>
            </Box>
          </Flex>
        </Card>
      </li>
    ))}
  </List>
);
