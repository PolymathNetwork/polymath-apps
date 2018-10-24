// @flow

import React, { Fragment } from 'react';
import { Field } from 'formik';
import { Tooltip, Toggle, Button } from 'carbon-components-react';
import {
  Box,
  Grid,
  DynamicTable,
  icoAdd,
  TextInput,
  thousandsDelimiter,
} from '@polymathnetwork/ui';

import AddTierModal from './AddTierModal';

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

type Props = {
  onChange: () => void,
  isMultipleTiers: boolean,
};

class InvestmentTiers extends React.Component<Props> {
  state = {
    isAddingTier: false,
  };

  onTiersToggle(isMultipleTiers) {
    // maybe trigger onChange with a single tier or an array of tiers?
    this.props.onChange({
      tiers: isMultipleTiers ? this.props.tiers : [this.props.tiers[0]],
      isMultipleTiers,
    });
  }

  handleCloseModal() {
    this.setState({ isAddingTier: false });
  }

  handleAddNewTier() {
    this.setState({ isAddingTier: true });
  }

  handleTierAdded(tier) {
    // add tier data in state?
  }

  render() {
    const { isMultipleTiers, tiers } = this.props;
    const { isAddingTier } = this.state;

    return (
      <Fragment>
        <div className="bx--form-item">
          <label htmlFor="investmentTiers" className="bx--label">
            <Tooltip triggerText="Investment Tiers">
              <p className="bx--tooltip__label">Investment Tiers</p>
              <p>
                Conversion rate between the currency you chose and your Security
                Token. E.g. 1000 means that 1 ETH (or POLY) will buy 1000
                Security Tokens.
              </p>
            </Tooltip>
          </label>
          <Toggle
            onToggle={this.onTiersToggle.bind(this)}
            toggled={isMultipleTiers}
            id="investmentTiers"
            labelA="Single"
            labelB="Multiple"
          />
        </div>

        {!isMultipleTiers ? (
          <Fragment>
            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <Field
                name="number-of-tokens"
                component={TextInput}
                normalize={thousandsDelimiter}
                label={
                  <Tooltip triggerText="Number of tokens">
                    <p className="bx--tooltip__label">Number of tokens</p>
                    <p>
                      Hard Cap is the maximum number of tokens available through
                      this offering. e.g. if you want the total aggregate of
                      your investors in this offering to own 10 million tokens,
                      enter 10000000.
                    </p>
                  </Tooltip>
                }
                placeholder="Enter amount"
              />
              <Field
                name="token-price"
                component={TextInput}
                normalize={thousandsDelimiter}
                label="Token Price"
                placeholder="Enter amount"
              />
            </Grid>
            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <Field
                name="number-of-discounted-tokens"
                component={TextInput}
                normalize={thousandsDelimiter}
                label={
                  <Tooltip triggerText="Number of tokens">
                    <p className="bx--tooltip__label">
                      maximum Number of Discounted tokens
                    </p>
                    <p />
                  </Tooltip>
                }
                placeholder="Enter amount"
              />
              <Field
                name="token-price"
                component={TextInput}
                normalize={thousandsDelimiter}
                label={
                  <Tooltip triggerText="Discount for Tokens Purchased with POLY">
                    <p className="bx--tooltip__label">
                      Discount for Tokens Purchased with POLY
                    </p>
                    <p />
                  </Tooltip>
                }
                placeholder="0"
              />
            </Grid>
          </Fragment>
        ) : (
          <DynamicTable
            rows={rows}
            headers={headers}
            render={({ rows, headers, getHeaderProps }) => (
              <TableContainer>
                <Box textAlign="right" mb={3}>
                  <Button
                    icon={icoAdd}
                    onClick={this.handleAddNewTier.bind(this)}
                  >
                    Add new
                  </Button>
                </Box>
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
        )}
        <AddTierModal
          title={`Add the Investment Tier #${tiers.length}`}
          isOpen={isAddingTier}
          onClose={this.handleCloseModal.bind(this)}
        />
      </Fragment>
    );
  }
}

export default InvestmentTiers;
