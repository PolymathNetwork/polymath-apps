import React, { FC } from 'react';
import { formatters, types } from '@polymathnetwork/new-shared';
import {
  Box,
  Card,
  Heading,
  CardPrimary,
  Icon,
  icons,
  Paragraph,
  Text,
  Flex,
  Label,
  theme,
  IconCircled,
  ButtonLink,
  ButtonFluid,
} from '@polymathnetwork/new-ui';
import { DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE } from '~/constants';
import * as sc from './styles';

interface Props {
  dividend: types.DividendEntity;
  checkpointIndex: number;
  securityTokenSymbol: string;
}

export const DividendCard: FC<Props> = ({
  dividend,
  securityTokenSymbol,
  checkpointIndex,
}) => {
  const {
    investors,
    currency,
    expiry,
    totalWithheld,
    totalWithheldWithdrawn,
  } = dividend;
  const currencyLabel = (currency || 'UNNAMED TOKEN').toUpperCase();
  let currencyType: string;
  let currencyColor: string;
  let currencyBgColor: string;

  const remainingPayments = investors.filter(
    investor => !investor.paymentReceived && !investor.excluded
  ).length;
  const remainingTransactions = Math.ceil(
    remainingPayments / DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE
  );
  const unwithdrawnTaxes = totalWithheld.minus(totalWithheldWithdrawn);
  const dividendComplete = expiry <= new Date() || remainingTransactions === 0;

  switch (currencyLabel) {
    case types.Tokens.Dai:
    case types.Tokens.Poly: {
      currencyColor = theme.tokens[currencyLabel].color;
      currencyBgColor = theme.tokens[currencyLabel].backgroundColor;
      currencyType = currencyLabel;
      break;
    }
    default: {
      currencyColor = theme.tokens[types.Tokens.Erc20].color;
      currencyBgColor = theme.tokens[types.Tokens.Erc20].backgroundColor;
      currencyType = 'ERC20';
      break;
    }
  }

  return (
    <Card width={300} height={370} p="gridGap">
      <Flex flexDirection="column" height="100%" alignItems="flex-start">
        <CardPrimary p={3} width="100%">
          <Flex justifyContent="space-between">
            <Text fontSize={0}>
              <span>Dividend Amount</span>
            </Text>
            <Text fontSize={0} color="gray.2">
              <span>{dividendComplete ? 'Completed' : 'Not completed'}</span>
              <Icon
                Asset={icons.SvgDot}
                width={16}
                height={16}
                color={dividendComplete ? 'success' : 'warning'}
              />
            </Text>
          </Flex>
          <Paragraph fontSize={4} color="baseText" mt="m">
            {formatters.toTokens(dividend.amount)} {currencyLabel}
          </Paragraph>
        </CardPrimary>
        <sc.DividendHeading mt="m" mb={1}>
          {dividend.name}
        </sc.DividendHeading>
        <Label color={currencyColor} bg={currencyBgColor}>
          Issued in {currencyType}
        </Label>
        {!dividendComplete ? (
          <Flex mt="m">
            <Flex flex="0" mr="s">
              <IconCircled
                Asset={icons.SvgWarning}
                width={26}
                height={26}
                color="white"
                bg="warning"
                scale={0.8}
              />
            </Flex>
            {remainingTransactions > 0 && (
              <Paragraph fontSize={0}>
                <strong>{remainingTransactions}</strong> remaining transactions
              </Paragraph>
            )}
          </Flex>
        ) : (
          remainingTransactions === 0 && (
            <Flex mt="m">
              <Paragraph fontSize={0}>
                <strong>
                  {formatters.toTokens(unwithdrawnTaxes)} {currencyType}
                </strong>{' '}
                tax withholdings left to withdraw
              </Paragraph>
            </Flex>
          )
        )}
        <Box mt="auto" minWidth="100%" textAlign="center">
          <ButtonFluid
            as={ButtonLink}
            href={`/securityTokens/${securityTokenSymbol}/checkpoints/${checkpointIndex}/dividends/${
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
