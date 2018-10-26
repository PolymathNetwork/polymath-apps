// @flow

import React, { Fragment } from 'react';
import { map, compact } from 'lodash';
import { Field, FieldArray, ErrorMessage } from 'formik';
import { Tooltip, Toggle, Button } from 'carbon-components-react';
import {
  Box,
  Grid,
  DynamicTable,
  icoAdd,
  thousandsDelimiter,
} from '@polymathnetwork/ui';
import InputError from '@polymathnetwork/ui/components/InputError';
import { NumberInput } from '@polymathnetwork/ui/next';

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
    key: 'tier',
    header: '# Tier',
  },
  {
    key: 'tokensAmount',
    header: 'Number of Tokens',
  },
  {
    key: 'tokenPrice',
    header: 'Token Price',
  },
  {
    key: 'discountedTokensAmount',
    header: 'Max Number of Discounted Tokens',
  },
  {
    key: 'discountedTokensPrice',
    header: 'POLY Discount',
  },
  {
    key: 'totalRaise',
    header: 'Total Raise Target',
  },
];

type FieldValue = {|
  isMultipleTiers: boolean,
  tiers: any[],
|};

type Props = {
  field: {
    value: FieldValue,
    name: string,
  },
  form: {
    setFieldValue: (name: string, value: any) => void,
    setFieldTouched: (name: string, value: boolean) => void,
  },
};

type State = {|
  isAddingTier: boolean,
|};

class InvestmentTiers extends React.Component<Props, State> {
  state = {
    isAddingTier: false,
  };

  onTiersToggle = () => {
    const {
      field: { value, name },
      form: { setFieldValue, setFieldTouched },
    } = this.props;
    const isMultipleTiers = !value.isMultipleTiers;

    // Reset tiers data when changing mode
    const newValue = {
      ...value,
      isMultipleTiers,
      tiers: [],
    };

    setFieldTouched(name, false);
    setFieldValue(name, newValue);
  };

  handleClose = () => {
    this.setState({ isAddingTier: false });
  };

  handleAddNewTier = () => {
    this.setState({ isAddingTier: true });
  };

  render() {
    const {
      field: { value, name },
    } = this.props;
    const { isAddingTier } = this.state;

    const tableItems = map(compact(value.tiers), (tier, tierNum) => ({
      ...tier,
      tier: tierNum,
      id: tierNum + 1,
      totalRaise: tier.tokenPrice * tier.tokensAmount,
    }));

    return (
      <Fragment>
        <div className="bx--form-item">
          <label htmlFor="investmentTiers" className="bx--label">
            <Tooltip triggerText="Investment Tiers">
              <p className="bx--tooltip__label">Investment Tiers</p>
              <p>
                All tokens may be sold at the same price (single-tier) or using
                a multi-tiered structure. If multiple tiers are used, tokens
                will be sold at the price defined in tier 2, once all tokens in
                tier 1 are sold.
              </p>
            </Tooltip>
          </label>
          <Field
            name={`${name}.isMultipleTiers`}
            onToggle={this.onTiersToggle}
            id={`${name}-isMultipleTiers`}
            labelA="Single"
            labelB="Multiple"
            component={Toggle}
          />
        </div>

        {!value.isMultipleTiers ? (
          <Fragment>
            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <div>
                <Field
                  name={`${name}.tiers[0].tokensAmount`}
                  component={NumberInput}
                  label={
                    <Tooltip triggerText="Number of tokens">
                      <p className="bx--tooltip__label">Number of tokens</p>
                      <p>
                        Hard Cap is the maximum number of tokens available
                        through this offering. e.g. if you want the total
                        aggregate of your investors in this offering to own 10
                        million tokens, enter 10000000.
                      </p>
                    </Tooltip>
                  }
                  placeholder="Enter amount"
                />
                <ErrorMessage
                  component={InputError}
                  name={`${name}.tiers[0].tokensAmount`}
                />
              </div>
              <div>
                <Field
                  name={`${name}.tiers[0].tokenPrice`}
                  component={NumberInput}
                  label="Token Price"
                  placeholder="Enter amount"
                  unit="USD"
                />
                <ErrorMessage
                  component={InputError}
                  name={`${name}.tiers[0].tokenPrice`}
                />
              </div>
            </Grid>
            <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
              <div>
                <Field
                  name={`${name}.tiers[0].discountedTokensAmount`}
                  component={NumberInput}
                  label={
                    <Tooltip triggerText="Number of discounted tokens">
                      <p className="bx--tooltip__label">
                        Maximum Number of Discounted tokens
                      </p>
                      <p />
                    </Tooltip>
                  }
                  placeholder="Enter amount"
                />
                <ErrorMessage
                  component={InputError}
                  name={`${name}.tiers[0].discountedTokensAmount`}
                />
              </div>
              <div>
                <Field
                  name={`${name}.tiers[0].discountedTokensPrice`}
                  component={NumberInput}
                  label={
                    <Tooltip triggerText="Discount for Tokens Purchased with POLY">
                      <p className="bx--tooltip__label">
                        Discount for Tokens Purchased with POLY
                      </p>
                      <p />
                    </Tooltip>
                  }
                  placeholder="Enter percentage"
                  unit="%"
                />
                <ErrorMessage
                  component={InputError}
                  name={`${name}.tiers[0].discountedTokensPrice`}
                />
              </div>
            </Grid>
          </Fragment>
        ) : (
          <Box mb={3}>
            <DynamicTable
              rows={tableItems}
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
                          <TableHeader
                            {...getHeaderProps({ header })}
                            type="button"
                          >
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
          </Box>
        )}
        <FieldArray
          name="investmentTiers.tiers"
          render={({ push }) => (
            <Field
              name="investmentTiers.newTier"
              component={AddTierModal}
              title={`Add the Investment Tier #${value.tiers.length}`}
              isOpen={isAddingTier}
              onAdd={push}
              onClose={this.handleClose}
            />
          )}
        />
      </Fragment>
    );
  }
}

export default InvestmentTiers;
