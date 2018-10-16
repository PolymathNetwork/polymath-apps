// @flow

import React, { Fragment } from 'react';
import { Tooltip, Toggle, Button } from 'carbon-components-react';
import { DynamicTable, icoAdd } from '@polymathnetwork/ui';

const {
  Table,
  TableContainer,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} = DynamicTable;

const headers = [
  {
    // `key` is the name of the field on the row object itself for the header
    key: 'tier',
    // `header` will be the name you want rendered in the Table Header
    header: '# Tier',
  },
  {
    key: 'tokensCount',
    header: 'Number of Tokens',
  },
  {
    key: 'tokenPrice',
    header: 'Token Price',
  },
  {
    key: 'discountedTokensCount',
    header: 'Max Number of Discounted Tokens',
  },
  {
    key: 'polyDiscount',
    header: 'POLY Discount',
  },
  {
    key: 'raiseTarget',
    header: 'Total Raise Target',
  },
];

const rows = [
  {
    id: 'a',
    tier: 1,
    tokensCount: 10,
    tokenPrice: 100,
    discountedTokensCount: 20000,
    polyDiscount: '10%',
    raiseTarget: 300000,
  },
];

const InvestmentTiers = () => (
  <Fragment>
    <div className="bx--form-item">
      <label htmlFor="investmentTiers" className="bx--label">
        <Tooltip triggerText="Investment Tiers">
          <p className="bx--tooltip__label">Investment Tiers</p>
          <p>
            Conversion rate between the currency you chose and your Security
            Token. E.g. 1000 means that 1 ETH (or POLY) will buy 1000 Security
            Tokens.
          </p>
        </Tooltip>
      </label>
      <Toggle
        onToggle={() => {}}
        toggled={false}
        id="investmentTiers"
        labelA="Single"
        labelB="Multiple"
      />
    </div>

    <DynamicTable
      rows={rows}
      headers={headers}
      render={({ rows, headers, getHeaderProps }) => (
        <TableContainer>
          <Button icon={icoAdd} onClick={() => {}}>
            Add new
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  {row.cells.map(cell => (
                    <TableCell key={cell.id}>{cell.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    />
  </Fragment>
);

export default InvestmentTiers;
