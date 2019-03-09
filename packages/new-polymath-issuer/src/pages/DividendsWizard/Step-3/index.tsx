import React, { Fragment, Component, FC } from 'react';
import {
  Box,
  Button,
  Heading,
  Card,
  Paragraph,
  Grid,
  FormItem,
  TextInput,
  CurrencySelect,
  TooltipIcon,
  Form,
  NumberInput,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';

interface Props {}
interface Values {
  currency: types.Tokens | null;
  distributionName: string;
  walletAddress: string;
  dividendAmount: BigNumber | null;
}

export const Step3: FC<Props> = () => {
  const onSubmit = (values: Values) => {
    // Format here
    console.log('values', values);
  };

  return (
    <Card p="gridGap">
      <Heading variant="h2" mb="l">
        3. Set Dividends Distribution Parameters
      </Heading>
      <Form<Values>
        enableReinitialize
        initialValues={{
          currency: null,
          distributionName: '',
          dividendAmount: null,
          walletAddress: '',
        }}
        onSubmit={onSubmit}
        render={({ handleSubmit, isValid, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Grid gridGap="gridGap" gridAutoFlow="row" width={512}>
                <FormItem name="distributionName">
                  <FormItem.Label>Dividend Distribution Name</FormItem.Label>
                  <FormItem.Input
                    component={TextInput}
                    placeholder="Enter the name"
                  />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="walletAddress">
                  <FormItem.Label>
                    <Paragraph>
                      <span>Wallet Address to Receive Tax Withholdings</span>
                      <TooltipIcon>
                        Taxes are withheld by the dividends smart contract at
                        the time dividends are distributed. This wallet address
                        will receive the tax withholdings when they are
                        withdrawn following the dividends distribution.
                      </TooltipIcon>
                    </Paragraph>
                  </FormItem.Label>
                  <FormItem.Input
                    component={TextInput}
                    placeholder="Enter wallet address"
                  />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="currency">
                  <FormItem.Label>Issue in</FormItem.Label>
                  <FormItem.Input
                    component={CurrencySelect}
                    placeholder="Choose currency"
                  />
                </FormItem>
                <Box width="336px" mt={0}>
                  <FormItem name="dividendAmount">
                    <FormItem.Label>Dividend Amount</FormItem.Label>
                    <FormItem.Input
                      component={NumberInput}
                      placeholder="Enter the value"
                      inputProps={{
                        min: new BigNumber(0),
                        max: new BigNumber('1000000000000000000'),
                        unit: values.currency,
                        useBignumbers: true,
                      }}
                    />
                    <FormItem.Error />
                  </FormItem>
                </Box>
              </Grid>
              <Box mt="xl">
                <Button type="submit">Configure Dividends</Button>
              </Box>
            </form>
          );
        }}
      />
    </Card>
  );
};
