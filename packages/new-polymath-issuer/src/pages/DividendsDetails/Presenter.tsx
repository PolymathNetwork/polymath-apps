import React, { Fragment } from 'react';
import {
  Button,
  ButtonFluid,
  Icon,
  IconOutlined,
  IconCircled,
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
import { types } from '@polymathnetwork/new-shared';

export interface Props {
  dividends: types.DividendPojo[];
  symbol: string;
}

const columns = [
  {
    Header: 'Investor Wallet Address',
    accessor: 'investorWalletAddress',
    Cell: ({ value }) => {
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
    Cell: ({ value }) => <Label color="green.1">{value}</Label>,
  },
];

const dataSet = [
  {
    investorWalletAddress: '0x9F510…00A3f1b',
    dividendsPreTax: '100,000.00 TOKEN',
    taxesWithheldPercent: '18%',
    taxesWithheldTokens: '300.00 TOKEN',
    dividendsPaid: '100,000.00 TOKEN',
    statusOfPayment: 'Completed',
  },
  {
    investorWalletAddress: '0x9F510…00A3f1b',
    dividendsPreTax: '100,000.00 TOKEN',
    taxesWithheldPercent: '18%',
    taxesWithheldTokens: '300.00 TOKEN',
    dividendsPaid: '100,000.00 TOKEN',
    statusOfPayment: 'Completed',
  },
];

export const Presenter = ({ symbol, dividends }: Props) => (
  <div>
    <Button variant="ghost" iconPosition="right">
      Go back
      <Icon Asset={icons.SvgArrow} width={18} height={17} />
    </Button>
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
                <IconOutlined
                  Asset={icons.SvgCheckmark}
                  width={64}
                  height={64}
                  color="success"
                  scale={0.9}
                  borderWidth="5px"
                />
                <Box ml="m">
                  <Text color="highlightText" fontSize={6} fontWeight={0}>
                    100%
                  </Text>
                  <Paragraph>transactions are completed</Paragraph>
                </Box>
              </Grid>
              <Paragraph>
                Dividends were successfully distributed to all applicable
                Investors.
              </Paragraph>
            </Box>
            <Box>
              <Hr />
              <Box mt="s" mb="l">
                <Text>0 Remaining number of transactions</Text>
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
                    0.00 TOKEN
                  </Text>
                  <Paragraph>
                    tax withholdings left to withdraw from the dividends smart
                    contract escrow
                  </Paragraph>
                </Box>
              </Grid>
              <Paragraph>
                Tax withholdings are automatically withheld by the smart
                contract at the time dividends are distributed. Tax withholding
                funds can be withdrawn at any time from the smart contract.
              </Paragraph>
            </Box>
            <Box>
              <Hr />
              <Box mb="s" mt={0}>
                <List vertical gridGap="s">
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <IconCircled
                          Asset={icons.SvgCheckmark}
                          bg="gray.2"
                          color="gray.0"
                          width={24}
                          height={24}
                          scale={0.9}
                        />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">5,000.00 TOKEN</Text> Taxes to
                        withhold
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <IconCircled
                          Asset={icons.SvgCheckmark}
                          bg="gray.2"
                          color="gray.0"
                          width={24}
                          height={24}
                          scale={0.9}
                        />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">5,000.00 TOKEN</Text> Taxes withheld
                        to-date.
                      </Paragraph>
                    </Flex>
                  </li>
                  <li>
                    <Flex>
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <IconCircled
                          Asset={icons.SvgCheckmark}
                          bg="gray.2"
                          color="gray.0"
                          width={24}
                          height={24}
                          scale={0.9}
                        />
                      </Flex>
                      <Paragraph>
                        <Text as="strong">5,000.00 TOKEN</Text> Taxes
                        withholdings withdrawn to-date
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
                <Text ml={1}>31 December, 2018</Text>
              </Flex>
              <List vertical gridGap="m" p="l">
                <li>
                  <Flex>
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        bg="inactive"
                        color="gray.0"
                        width={24}
                        height={24}
                        scale={0.9}
                      />
                    </Flex>
                    <Paragraph>
                      <Text as="strong">1400</Text> Investors held the token at
                      checkpoint time
                    </Paragraph>
                  </Flex>
                </li>
                <li>
                  <Flex>
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        bg="inactive"
                        color="gray.0"
                        width={24}
                        height={24}
                        scale={0.9}
                      />
                    </Flex>
                    <Paragraph>
                      <Text as="strong">200</Text> Investors were excluded from
                      the dividends distribution
                    </Paragraph>
                  </Flex>
                </li>
                <li>
                  <Flex>
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        bg="inactive"
                        color="gray.0"
                        width={24}
                        height={24}
                        scale={0.9}
                      />
                    </Flex>
                    <Paragraph>
                      <Text as="strong">1000</Text> Investors included for tax
                      withholding
                    </Paragraph>
                  </Flex>
                </li>
                <li>
                  <Hr />
                  <Flex>
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        bg="gray.3"
                        color="gray.0"
                        width={24}
                        height={24}
                        scale={0.9}
                      />
                    </Flex>
                    <Paragraph>
                      <Text as="strong">1,200</Text> Investors received
                      dividends
                    </Paragraph>
                  </Flex>
                </li>
                <li>
                  <Flex>
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        bg="gray.3"
                        color="gray.0"
                        width={24}
                        height={24}
                        scale={0.9}
                      />
                    </Flex>
                    <Paragraph>
                      <Text as="strong">1,000</Text> Investors had their taxes
                      withheld
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
              <Text fontSize={6}>200,000.00 TOKEN</Text>
            </Box>
          </Grid>
        </CardPrimary>
      </GridRow.Col>
    </GridRow>
    <Heading variant="h2" mt="l" mb="m">
      Transactions
    </Heading>
    <Table columns={columns} data={dataSet}>
      <Table.Rows />
      <Table.Pagination />
    </Table>
  </div>
);
