// @flow

import React, { Fragment } from 'react';
import { map, compact } from 'lodash';
import { Field, FieldArray } from 'formik';
import { Tooltip, Toggle, Button } from 'carbon-components-react';
import { iconAddSolid } from 'carbon-icons';
import {
  Box,
  Grid,
  DynamicTable,
  FormItem,
  NumberInput,
  PercentageInput,
} from '@polymathnetwork/ui';
import { format } from '@polymathnetwork/shared/utils';

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
  ticker: string,
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
      tiers: isMultipleTiers
        ? []
        : [
            {
              tokensAmount: null,
              tokenPrice: null,
            },
          ],
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
      ticker,
    } = this.props;
    const { isAddingTier } = this.state;

    const tableItems = map(compact(value.tiers), (tier, tierNum) => {
      return {
        ...tier,
        tokensAmount: format.toTokens(tier.tokensAmount, { decimals: 0 }),
        tokenPrice: format.toUSD(tier.tokenPrice),
        totalRaise: format.toUSD(tier.tokenPrice * tier.tokensAmount),
        tier: tierNum + 1,
        id: tierNum + 1,
      };
    });

    const defaultTableItem = [
      {
        tokenPrice: '-',
        tokensAmount: '-',
        tier: '-',
        id: 0,
        totalRaise: '-',
      },
    ];

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
            <Grid gridAutoFlow="column" gridAutoColumns="1fr">
              <FormItem name={`${name}.tiers[0].tokensAmount`}>
                <FormItem.Label>
                  <Tooltip triggerText="Number of tokens">
                    <p className="bx--tooltip__label">Number of tokens</p>
                    <p>
                      Number of tokens to be sold in this tier. All tokens in
                      the tier will carry the same price and need to be sold for
                      the STO to move to the next tier (if multiple tiers are
                      defined).
                    </p>
                  </Tooltip>
                </FormItem.Label>
                <FormItem.Input
                  FormikComponent={Field}
                  component={NumberInput}
                  placeholder="Enter amount"
                  useBigNumbers
                />
                <FormItem.Error />
              </FormItem>
              <FormItem name={`${name}.tiers[0].tokenPrice`}>
                <FormItem.Label>Token Price</FormItem.Label>
                <FormItem.Input
                  FormikComponent={Field}
                  component={NumberInput}
                  placeholder="Enter amount"
                  unit="USD"
                  useBigNumbers
                />
                <FormItem.Error />
              </FormItem>
            </Grid>
          </Fragment>
        ) : (
          <Box mb={3}>
            <DynamicTable
              rows={tableItems.length ? tableItems : defaultTableItem}
              headers={headers}
              render={({ rows, headers, getHeaderProps }) => (
                <TableContainer>
                  <Box textAlign="right" mb={3}>
                    <Button
                      icon={iconAddSolid}
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
              ticker={ticker}
              component={AddTierModal}
              title={`Add the Investment Tier #${value.tiers.length + 1}`}
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
