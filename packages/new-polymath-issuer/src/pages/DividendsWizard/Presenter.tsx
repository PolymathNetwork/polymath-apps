import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  GridRow,
  Card,
  Paragraph,
  Link,
  List,
  Remark,
  Flex,
  Form,
  FormItem,
  Checkbox,
  Text,
  ProgressIndicator,
  CardPrimary,
  IconCircled,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import * as sc from './styles';

export interface Props {
  dividends: types.DividendPojo[];
  symbol: string;
}

export const Presenter = ({ symbol, dividends }: Props) => (
  <div>
    <Text color="primary">
      <Button variant="ghost" iconPosition="right">
        Go back
        <Icon Asset={icons.SvgArrow} width={18} height={17} />
      </Button>
    </Text>
    <Heading variant="h1" as="h1">
      Create New Dividend Distribution
    </Heading>
    <GridRow>
      <GridRow.Col gridSpan={{ sm: 12, lg: 8 }}>
        <Card p="gridGap" boxShadow={1}>
          <Heading variant="h2" mb="l">
            1. Exclude Wallets from the Dividends Calculation
          </Heading>
          <Paragraph>
            Optionally exclude specific investor wallet addresses from the
            dividends calculation and distribution by uploading their address
            via a CSV which includes one wallet (ETH) address per line.
          </Paragraph>
          <Paragraph>
            You can download{' '}
            <Link href="">
              <Icon Asset={icons.SvgDownload} /> Sample-Excluding-List.csv
            </Link>{' '}
            file and edit it.
          </Paragraph>
          <Remark>
            The number of tokens contained in the wallets excluded from the
            dividends calculation and distribution will be deducted from the
            total supply before the final percentages are calculated. For
            example if 10 wallets each contain 1 tokens and 2 wallets are
            excluded from dividends, each wallet will receive 1/8 of the
            dividends.
            <br />
            <strong>Maximum number of addresses per transaction is 100.</strong>
            <br /> If you want to exclude more than 100 wallets, please
            breakdown the list in 100 wallets increments and upload them one at
            a time.
          </Remark>
          <Heading variant="h3" mt="m">
            No Dividends Exclusion Required
          </Heading>
          <Form
            initialValues={{
              noWalletExcluded: false,
            }}
            onSubmit={() => {}}
            render={({ handleSubmit, isValid }) => (
              <Fragment>
                <FormItem name="walletAddress">
                  <FormItem.Input
                    component={Checkbox}
                    label="I confirm that no wallets must be excluded from the dividends
                  distribution."
                  />
                  <FormItem.Error />
                </FormItem>
                <Box mt="xl">
                  <Button type="submit">
                    Update list and proceed to the next step
                  </Button>
                </Box>
              </Fragment>
            )}
          />
        </Card>
      </GridRow.Col>
      <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
        <Box height={250} mb="xl">
          <sc.WizardProgress currentIndex={0} vertical ordered>
            <ProgressIndicator.Step label="Dividends Exclusion List" />
            <ProgressIndicator.Step label="Tax Withholdings List" />
            <ProgressIndicator.Step label="Dividends Distribution Parameters" />
          </sc.WizardProgress>
        </Box>
        <CardPrimary as="section" p="m">
          <Heading variant="h3" mb="l">
            New Dividends Distribution
          </Heading>
          <Box mb="l">
            <List vertical>
              <li>
                <Flex>
                  <Flex flex="0" alignSelf="flex-start" mr="s">
                    <IconCircled
                      Asset={icons.SvgCheckmark}
                      bg="inactive"
                      color="gray.1"
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
                      color="gray.1"
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
            </List>
          </Box>
          <Text as="strong" mt="m">
            Total Dividend Distribution
          </Text>
          <br />
          <Text fontSize={6}>0.00 -</Text>
        </CardPrimary>
      </GridRow.Col>
    </GridRow>
  </div>
);
