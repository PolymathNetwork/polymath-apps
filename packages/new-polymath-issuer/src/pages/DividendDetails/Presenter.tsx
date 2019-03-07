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
} from '@polymathnetwork/new-ui';
import { types, formatters } from '@polymathnetwork/new-shared';
import _ from 'lodash';
import BigNumber from 'bignumber.js';
import { ListIcon } from '~/components/ListIcon';

export interface Props {
  dividend: types.DividendEntity;
  taxWithholdings: types.TaxWithholdingEntity[];
  symbol: string;
}

const columns = [
  {
    Header: 'Investor Wallet Address',
    accessor: 'investorWalletAddress',
    Cell: ({ value }: { value: string }) => {
      return <Link href="#">{value}</Link>;
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
    Header: 'Taxes Withheld (TOKEN)',
    accessor: 'taxesWithheldTokens',
  },
  {
    Header: 'Dividends Paid',
    accessor: 'dividendsPaid',
  },
  {
    Header: 'Status of Payment',
    accessor: 'statusOfPayment',
    Cell: ({ value }: { value: string }) => (
      <Label color="green.1">{value}</Label>
    ),
  },
];

export const Presenter = ({ symbol, dividend, taxWithholdings }: Props) => {
  const processedTransactions = _.sumBy(
    dividend.investors,
    (i: types.DividendInvestorStatus) => Number(i.paymentReceived)
  );
  const totalTransactions = _.size(dividend.investors);
  const totalInvestors = _.size(dividend.investors);
  const excludedInvestors = _.sumBy(
    dividend.investors,
    (i: types.DividendInvestorStatus) => Number(i.excluded)
  );
  const investorsReceivedPayment = _.sumBy(
    dividend.investors,
    (i: types.DividendInvestorStatus) => Number(i.paymentReceived)
  );
  const investorsHadTaxesWithheld = _.sumBy(
    dividend.investors,
    (i: types.DividendInvestorStatus) => Number(!i.withheldTax.isEqualTo(0))
  );
  const totalTaxesWithheld: BigNumber = _.reduce(
    dividend.investors,
    (total: BigNumber, cur: types.DividendInvestorStatus) =>
      total.plus(cur.withheldTax),
    new BigNumber(0)
  );

  // Transactions
  const transactions = dividend.investors.map((investor, key) => ({
    investorWalletAddress: formatters.toShortAddress(investor.address),
    dividendsPreTax: `${formatters.toTokens(
      investor.amountReceived.plus(investor.withheldTax)
    )}  ${dividend.securityTokenSymbol}`,
    taxesWithheldPercent: formatters.toPercent(
      investor.withheldTax.dividedBy(investor.amountReceived)
    ),
    taxesWithheldTokens: `${formatters.toTokens(investor.withheldTax)} ${
      dividend.securityTokenSymbol
    }`,
    dividendsPaid: `${formatters.toPercent(investor.amountReceived)} ${
      dividend.securityTokenSymbol
    }`,
    statusOfPayment: investor.paymentReceived ? 'Completed' : 'Incomplete',
  }));

  return (
    <div>
      <ButtonLink
        variant="ghostSecondary"
        iconPosition="right"
        href={`/securityTokens/${dividend.securityTokenSymbol}/dividends`}
      >
        Go back
        <Icon Asset={icons.SvgArrow} width={18} height={18} />
      </ButtonLink>
      <Heading variant="h1" as="h1">
        Stunning Dividend Distribution Title Example
      </Heading>
      <GridRow>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <Card p="gridGap" height={425}>
            <Grid height="100%" gridAutoRows="1fr auto">
              <Box>
                <Grid
                  mb={4}
                  gridAutoFlow="column"
                  gridGap={0}
                  gridAutoColumns="auto 1fr"
                >
                  {processedTransactions === totalTransactions && (
                    <IconOutlined
                      Asset={icons.SvgCheckmark}
                      width={64}
                      height={64}
                      color="success"
                      scale={0.8}
                      borderWidth="5px"
                    />
                  )}
                  {processedTransactions !== totalTransactions && (
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
                    <Text color="highlightText" fontSize={6} fontWeight={0}>
                      {formatters.toPercent(
                        processedTransactions / totalTransactions
                      )}
                    </Text>
                    <Paragraph>transactions are completed</Paragraph>
                  </Box>
                </Grid>
                {processedTransactions === totalTransactions && (
                  <Paragraph>
                    Dividends were successfully distributed to all applicable
                    Investors.
                  </Paragraph>
                )}
                {processedTransactions !== totalTransactions && (
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
                  <Text>
                    {totalTransactions - processedTransactions} Remaining number
                    of transactions
                  </Text>
                </Box>
                <ButtonFluid disabled>
                  Submit Outstanding Transactions
                </ButtonFluid>
              </Box>
            </Grid>
          </Card>
        </GridRow.Col>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <Card p="gridGap" height={425}>
            <Grid height="100%" gridAutoRows="1fr auto" gridGap="s">
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
                    <Text color="highlightText" fontSize={6} fontWeight={0}>
                      0.00 {symbol}
                    </Text>
                    <Paragraph>
                      tax withholdings left to withdraw from the dividends smart
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
                          <Text as="strong">5,000.00 {symbol}</Text> Taxes to
                          withhold
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
                            {formatters.toTokens(5000)} {symbol}
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
                            {formatters.toTokens(totalTaxesWithheld)} {symbol}
                          </Text>{' '}
                          Taxes withholdings withdrawn to-date
                        </Paragraph>
                      </Flex>
                    </li>
                  </List>
                </Box>
                <ButtonFluid variant="secondary">Withdraw Taxes</ButtonFluid>
              </Box>
            </Grid>
          </Card>
        </GridRow.Col>
        <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
          <CardPrimary as="section" p="m" height={425}>
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
                  <Text ml={1}>
                    {formatters.toDateFormat(dividend.created)}
                  </Text>
                </Flex>
                <List vertical gridGap="m">
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">{totalInvestors}</Text> Investors held
                        the token at checkpoint time
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">{excludedInvestors}</Text> Investors
                        were excluded from the dividends distribution
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">{_.size(taxWithholdings)}</Text>{' '}
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
                        <Text as="strong">{investorsReceivedPayment}</Text>{' '}
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
                        <Text as="strong">{investorsHadTaxesWithheld}</Text>{' '}
                        Investors had their taxes withheld
                      </Paragraph>
                    </Flex>
                  </li>
                </List>
              </Box>
              <Box>
                <Text as="strong" mt="m">
                  Total Dividend Distribution
                </Text>
                <br />
                <Text fontSize={6}>
                  {formatters.toTokens(dividend.claimedAmount)} {symbol}
                </Text>
              </Box>
            </Grid>
          </CardPrimary>
        </GridRow.Col>
      </GridRow>
      <Heading variant="h2" mt="l" mb="m">
        Transactions
      </Heading>
      <Table columns={columns} data={transactions}>
        <Table.Rows />
        <Table.Pagination />
      </Table>
    </div>
  );
};
