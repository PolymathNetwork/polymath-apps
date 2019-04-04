import React from 'react';
import {
  ButtonFluid,
  ButtonLink,
  Icon,
  IconOutlined,
  icons,
  Heading,
  GridRow,
  Card,
  CardPrimary,
  Paragraph,
  Table,
  Flex,
  Box,
  Text,
  List,
  Grid,
  Label,
  Link,
  Hr,
  LoadingDots,
} from '@polymathnetwork/new-ui';
import { utils, types, formatters } from '@polymathnetwork/new-shared';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { ListIcon } from '~/components/ListIcon';
import { DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE } from '~/constants';

export interface Props {
  dividend: types.DividendEntity;
  taxWithholdings: types.TaxWithholdingEntity[];
  symbol: string;
  pushDividendPayments: () => void;
  withdrawTaxes: () => void;
  subdomain?: string;
  loading?: boolean;
}

enum PaymentStatus {
  Completed = 'Completed',
  Incomplete = 'Incomplete',
}

export const Presenter = ({
  symbol,
  dividend,
  taxWithholdings,
  pushDividendPayments,
  withdrawTaxes,
  subdomain,
  loading,
}: Props) => {
  const {
    investors,
    amount,
    totalSupply,
    currency = 'UNNAMED TOKEN',
    created,
    name,
    claimedAmount,
    totalWithheld,
    totalWithheldWithdrawn,
  } = dividend;

  const amountToPay = (investor: types.DividendInvestorStatus) => {
    const { balance } = investor;

    return amount.times(balance.dividedBy(totalSupply));
  };

  const columns = [
    {
      Header: 'Investor Wallet Address',
      accessor: 'investorWalletAddress',
      Cell: ({ value }: { value: string }) => {
        return (
          <Link
            href={utils.toEtherscanUrl(value, { subdomain, type: 'address' })}
          >
            {formatters.toShortAddress(value)}
          </Link>
        );
      },
    },
    {
      Header: 'Dividends Pre-Tax',
      accessor: 'dividendsPreTax',
    },
    {
      Header: 'Taxes Withheld (%)',
      accessor: 'taxesWithheldPercent',
    },
    {
      Header: `Taxes Withheld (${currency})`,
      accessor: 'taxesWithheldTokens',
    },
    {
      Header: 'Dividends Paid',
      accessor: 'dividendsPaid',
    },
    {
      Header: 'Status of Payment',
      accessor: 'statusOfPayment',
      Cell: ({ value }: { value: PaymentStatus }) => {
        // TODO @monitz87: select color depending on the status
        return <Label color="green.1">{value}</Label>;
      },
    },
  ];

  const excludedInvestors = investors.filter(investor => investor.excluded);
  const nonExcludedInvestors = investors.filter(investor => !investor.excluded);
  const paidInvestorsAmount = _.sumBy(nonExcludedInvestors, investor =>
    Number(investor.paymentReceived)
  );
  const totalPayments = _.size(nonExcludedInvestors);
  const pendingPayments = totalPayments - paidInvestorsAmount;
  const totalTransactions = Math.ceil(
    totalPayments / DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE
  );
  const pendingTransactions = Math.ceil(
    pendingPayments / DIVIDEND_PAYMENT_INVESTOR_BATCH_SIZE
  );
  const totalInvestorsAmount = _.size(investors);
  const excludedInvestorAmount = _.size(excludedInvestors);
  const investorsReceivedPayment = nonExcludedInvestors.filter(
    investor => investor.paymentReceived
  );
  const investorsReceivedPaymentAmount = _.size(investorsReceivedPayment);
  const investorsHadTaxesWithheldAmount = _.sumBy(
    investorsReceivedPayment,
    (i: types.DividendInvestorStatus) => Number(!i.withheldTax.isEqualTo(0))
  );
  const positiveTaxWithholdings = taxWithholdings.filter(
    taxWithholding =>
      !!taxWithholding.percentage &&
      !excludedInvestors.find(
        ({ address }) => address === taxWithholding.investorAddress
      )
  );

  const unpaidInvestors = nonExcludedInvestors.filter(
    investor => !investor.paymentReceived
  );

  const unwithdrawnTaxes = totalWithheld.minus(totalWithheldWithdrawn);

  const unwithheldTaxes = _.reduce(
    unpaidInvestors,
    (currentSum, investor) => {
      const { address } = investor;
      const investorWithholding = positiveTaxWithholdings.find(
        taxWithholding => taxWithholding.investorAddress === address
      );

      let taxesToWithhold = new BigNumber(0);

      if (investorWithholding) {
        taxesToWithhold = amountToPay(investor).times(
          new BigNumber(investorWithholding.percentage)
        );
      }

      return currentSum.plus(taxesToWithhold);
    },
    new BigNumber(0)
  );

  // Transactions
  const transactions = nonExcludedInvestors.map(investor => {
    const { address, withheldTax, amountReceived, paymentReceived } = investor;

    const preTaxPayment = amountToPay(investor);

    return {
      investorWalletAddress: address,
      dividendsPreTax: `${formatters.toTokens(preTaxPayment, {
        decimals: 6,
      })} ${currency}`,
      taxesWithheldPercent: formatters.toPercent(
        paymentReceived
          ? withheldTax.dividedBy(preTaxPayment)
          : new BigNumber(0)
      ),
      taxesWithheldTokens: `${formatters.toTokens(
        paymentReceived ? withheldTax : new BigNumber(0),
        { decimals: 6 }
      )} ${currency}`,
      dividendsPaid: `${formatters.toTokens(
        paymentReceived ? amountReceived : new BigNumber(0),
        { decimals: 6 }
      )} ${currency}`,
      statusOfPayment: paymentReceived
        ? PaymentStatus.Completed
        : PaymentStatus.Incomplete,
    };
  });

  return (
    <div>
      <Text color="primary">
        <ButtonLink
          variant="ghostSecondary"
          iconPosition="right"
          href={`/securityTokens/${symbol}/dividends`}
        >
          Go back
          <Icon Asset={icons.SvgArrow} width={18} height={18} />
        </ButtonLink>
      </Text>
      <Heading variant="h1" as="h1">
        {name}
      </Heading>
      <GridRow>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <Card p="gridGap" height="100%">
            <Grid height="100%" gridAutoRows="1fr auto">
              <Box>
                <Grid
                  mb={4}
                  gridAutoFlow="column"
                  gridGap={0}
                  gridAutoColumns="auto 1fr"
                >
                  {!pendingPayments && (
                    <IconOutlined
                      Asset={icons.SvgCheckmark}
                      width={64}
                      height={64}
                      color="success"
                      scale={0.8}
                      borderWidth="5px"
                    />
                  )}
                  {!!pendingPayments && (
                    <IconOutlined
                      Asset={icons.SvgWarning}
                      width={64}
                      height={64}
                      color="warning"
                      scale={0.8}
                      borderWidth="5px"
                    />
                  )}
                  <Box ml="m">
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <Text color="highlightText" fontSize={6} fontWeight={0}>
                        {formatters.toPercent(
                          1 - pendingTransactions / (totalTransactions || 1)
                        )}
                      </Text>
                    )}
                    <Paragraph>Transactions are completed</Paragraph>
                  </Box>
                </Grid>
                {!pendingPayments && (
                  <Paragraph>
                    Dividends were successfully distributed to all applicable
                    Investors.
                  </Paragraph>
                )}
                {!!pendingPayments && (
                  <Paragraph>
                    Dividends are automatically distributed to your Investor
                    wallets. Should any transaction fail to complete, you can
                    submit all transactions that did not complete until the
                    number of outstanding transactions is 0.
                  </Paragraph>
                )}
              </Box>
              <Box>
                <Hr />
                <Box mt="s" mb="l">
                  <Text>{pendingTransactions} remaining transactions</Text>
                </Box>
                <ButtonFluid
                  disabled={!pendingPayments}
                  onClick={pushDividendPayments}
                >
                  Complete Transactions
                </ButtonFluid>
              </Box>
            </Grid>
          </Card>
        </GridRow.Col>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <Card p="gridGap" height="100%">
            <Grid height="100%" gridAutoRows="1fr auto auto" gridGap="s">
              <Box>
                <Grid
                  mb={4}
                  gridAutoFlow="column"
                  gridGap={0}
                  gridAutoColumns="auto 1fr"
                >
                  <IconOutlined
                    Asset={icons.SvgTaxes}
                    width={64}
                    height={64}
                    color="secondary"
                    borderWidth="5px"
                  />
                  <Box ml="m">
                    {loading ? (
                      <LoadingDots />
                    ) : (
                      <Text color="highlightText" fontSize={6} fontWeight={0}>
                        {formatters.toTokens(unwithdrawnTaxes)} {currency}
                      </Text>
                    )}
                    <Paragraph>
                      Tax withholdings left to withdraw from the dividends smart
                      contract escrow
                    </Paragraph>
                  </Box>
                </Grid>
                <Paragraph>
                  Tax withholdings are automatically withheld by the smart
                  contract at the time dividends are distributed. Tax
                  withholding funds can be withdrawn at any time from the smart
                  contract.
                </Paragraph>
              </Box>
              <Hr />
              <Box>
                <Box mb="s" mt={0}>
                  <List vertical gridGap="s">
                    <li>
                      <Flex>
                        <Flex flex="0" alignSelf="flex-start" mr="s">
                          <ListIcon />
                        </Flex>
                        <Paragraph>
                          <Text as="strong">
                            {formatters.toTokens(unwithheldTaxes)} {currency}
                          </Text>{' '}
                          Taxes to withhold
                        </Paragraph>
                      </Flex>
                    </li>
                    <li>
                      <Flex>
                        <Flex flex="0" alignSelf="flex-start" mr="s">
                          <ListIcon />
                        </Flex>
                        <Paragraph>
                          <Text as="strong">
                            {formatters.toTokens(totalWithheld)} {currency}
                          </Text>{' '}
                          Taxes withheld to-date.
                        </Paragraph>
                      </Flex>
                    </li>
                    <li>
                      <Flex>
                        <Flex flex="0" alignSelf="flex-start" mr="s">
                          <ListIcon />
                        </Flex>
                        <Paragraph>
                          <Text as="strong">
                            {formatters.toTokens(totalWithheldWithdrawn)}{' '}
                            {currency}
                          </Text>{' '}
                          Taxes withholdings withdrawn to-date
                        </Paragraph>
                      </Flex>
                    </li>
                  </List>
                </Box>
                <ButtonFluid
                  variant="secondary"
                  disabled={unwithdrawnTaxes.eq(new BigNumber(0))}
                  onClick={withdrawTaxes}
                >
                  Withdraw Taxes
                </ButtonFluid>
              </Box>
            </Grid>
          </Card>
        </GridRow.Col>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <CardPrimary as="section" p="m" height="100%">
            <Grid height="100%" gridAutoRows="1fr auto" gridGap="s">
              <Box>
                <Heading variant="h3" mb="s">
                  General Information
                </Heading>
                <Flex mb={4}>
                  <Icon Asset={icons.SvgCalendar} width={18} height={17} />
                  <Text as="strong" ml={1}>
                    Date Created
                  </Text>
                  <Text ml={1}>{formatters.toDateFormat(created)}</Text>
                </Flex>
                <List vertical gridGap="m">
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">{totalInvestorsAmount}</Text>{' '}
                        Investors held the token at checkpoint time
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">{excludedInvestorAmount}</Text>{' '}
                        Investors were excluded from the dividends distribution
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">
                          {_.size(positiveTaxWithholdings)}
                        </Text>{' '}
                        Investors included for tax withholding
                      </Paragraph>
                    </Flex>
                  </li>
                </List>
                <Hr color="gray.2" />
                <List vertical gridGap="m">
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon active />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">
                          {investorsReceivedPaymentAmount}
                        </Text>{' '}
                        Investors received dividends
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon active />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">
                          {investorsHadTaxesWithheldAmount}
                        </Text>{' '}
                        Investors had their taxes withheld
                      </Paragraph>
                    </Flex>
                  </li>
                </List>
              </Box>
              <Box>
                <Text as="strong" mt="m">
                  Total Dividends Distributed
                </Text>
                <br />
                <Text fontSize={6}>
                  {formatters.toTokens(claimedAmount, { decimals: 6 })}{' '}
                  {currency}
                </Text>
              </Box>
            </Grid>
          </CardPrimary>
        </GridRow.Col>
      </GridRow>
      <Heading variant="h2" mt="l" mb="m">
        Transactions
      </Heading>
      {loading ? (
        <Box mt="l" mb="m">
          <LoadingDots />
        </Box>
      ) : (
        <Table columns={columns} data={transactions}>
          <Table.Rows />
          <Table.Pagination />
        </Table>
      )}
    </div>
  );
};
