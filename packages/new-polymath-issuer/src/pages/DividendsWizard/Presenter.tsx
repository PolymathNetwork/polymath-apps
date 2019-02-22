import React, { Fragment } from 'react';
import {
  Button,
  Icon,
  icons,
  Heading,
  GridRow,
  Card,
  Paragraph,
  Link,
  Remark,
} from '@polymathnetwork/new-ui';
import { types } from '@polymathnetwork/new-shared';
import * as sc from './styles';

export interface Props {
  dividends: types.DividendPojo[];
  symbol: string;
}

export const Presenter = ({ symbol, dividends }: Props) => (
  <div>
    <Button variant="ghost" iconPosition="right">
      Go back
      <Icon Asset={icons.SvgArrow} width={18} height={17} />
    </Button>
    <Heading variant="h1" as="h1">
      Create New Dividend Distribution
    </Heading>
    <GridRow>
      <GridRow.Col gridSpan={{ sm: 12, lg: 7 }}>
        <Card p="gridGap">
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
          <Heading variant="h3">No Dividends Exclusion Required</Heading>
        </Card>
      </GridRow.Col>
      <GridRow.Col gridSpan={{ sm: 12, lg: 5 }} />
    </GridRow>
  </div>
);
