import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Link,
  Remark,
  Form,
  FormItem,
  Checkbox,
  List,
} from '@polymathnetwork/new-ui';

export interface Props {}

export const Step2 = ({  }: Props) => (
  <Card p="gridGap" boxShadow={1}>
    <Heading variant="h2" mb="l">
      2. Add/Update Tax Withholdings List
    </Heading>
    <Paragraph>
      Optionally withhold taxes for applicable investor wallet addresses by
      uploading a CSV which includes, for investors subject to tax withholdings:{' '}
      <List vertical gridGap={0}>
        <li>— Investor wallet's ETH Address;</li>
        <li>
          — % tax witholding for associated ETH address. The exact amount of
          funds to be withheld will be automatically calculated prior to
          distribution.
        </li>
      </List>
    </Paragraph>
    <Paragraph>
      You can download{' '}
      <Link href="" download>
        <Icon Asset={icons.SvgDownload} /> Sample-Excluding-List.csv
      </Link>{' '}
      file and edit it.
    </Paragraph>
    <Remark>
      The number of tokens contained in the wallets excluded from the dividends
      calculation and distribution will be deducted from the total supply before
      the final percentages are calculated. For example if 10 wallets each
      contain 1 tokens and 2 wallets are excluded from dividends, each wallet
      will receive 1/8 of the dividends.
      <br />
      <strong>Maximum number of addresses per transaction is 100.</strong>
      <br /> If you want to exclude more than 100 wallets, please breakdown the
      list in 100 wallets increments and upload them one at a time.
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
);
