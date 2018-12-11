// @flow

import React, { Fragment } from 'react';
import { map, compact } from 'lodash';
import { Field, FieldArray } from 'formik';
import { Toggle, Button } from 'carbon-components-react';
import { iconAddSolid } from 'carbon-icons';

import { Icon } from '@polymathnetwork/ui';
import DeleteIcon from '@polymathnetwork/ui/images/icons/Delete';
import BigNumber from 'bignumber.js';
import {
  Box,
  Grid,
  DynamicTable,
  FormItem,
  FormItemGroup,
  Tooltip,
  NumberInput,
} from '@polymathnetwork/ui';
import { format } from '@polymathnetwork/shared/utils';

import AddTierModal from './AddTierModal';
import RemoveTierModal from './RemoveTierModal';

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

export default class InvestmentTiers extends React.Component<Props, State> {
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
      isMultipleTiers,
      /**
       * NOTE @monitz87: If switching back to single tier, we repopulate the array
       * to have initial values in the single-tier form for validation
       */
      tiers: isMultipleTiers
        ? []
        : [
            {
              tokensAmount: null,
              tokenPrice: null,
            },
          ],
      newTier: isMultipleTiers
        ? {
            tokensAmount: null,
            tokenPrice: null,
          }
        : null,
    };

    setFieldTouched(name, false);
    setFieldValue(name, newValue);
  };

  handleCloseAddTier = () => {
    this.setState({ isAddingTier: false });
  };

  handleAddNewTier = () => {
    this.setState({ isAddingTier: true });
  };

  handleRemoveTier = index => {
    this.setState({
      removingTierIndex: index,
    });
  };

  handleCloseRemoveTier() {
    this.setState({
      removingTierIndex: null,
    });
  }

  render() {
    const {
      field: { value, name },
      form: { touched, errors },
      ticker,
    } = this.props;
    const { isAddingTier } = this.state;

    const tableItems = map(compact(value.tiers), (tier, tierNum) => {
      const tokenPrice = tier.tokenPrice || new BigNumber(0);
      const tokensAmount = tier.tokensAmount || new BigNumber(0);
      const tierNo = `${tierNum + 1}`;

      return {
        ...tier,
        tokensAmount: format.toTokens(tokensAmount, { decimals: 0 }),
        tokenPrice: format.toUSD(tokenPrice),
        totalRaise: format.toUSD(tokenPrice.times(tokensAmount)),
        tier: tierNo,
        id: tierNo,
      };
    });

    const defaultTableItem = [
      {
        tokenPrice: '-',
        tokensAmount: '-',
        tier: '-',
        id: '0',
        totalRaise: '-',
      },
    ];

    return (
      <Fragment>
        <FormItem name={`${name}.isMultipleTiers`}>
          <FormItem.Label>
            <Tooltip triggerText="Investment Tiers">
              <p>
                <strong>Investment Tiers</strong>
              </p>
              <p>
                All tokens may be sold at the same price (single-tier) or using
                a multi-tiered structure. If multiple tiers are used, tokens
                will be sold at the price defined in tier 2, once all tokens in
                tier 1 are sold.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            onToggle={this.onTiersToggle}
            id={`${name}-isMultipleTiers`}
            labelA="Single"
            labelB="Multiple"
            component={Toggle}
          />
        </FormItem>

        {!value.isMultipleTiers ? (
          <Fragment>
            <Grid gridAutoFlow="column" gridAutoColumns="1fr">
              <FormItem name={`${name}.tiers[0].tokensAmount`}>
                <FormItem.Label>
                  <Tooltip triggerText="Number of tokens">
                    <p>
                      <strong>Number of tokens</strong>
                    </p>
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
            <FormItemGroup>
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
                          <TableHeader>...</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row, index) => (
                          <TableRow key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                            {row.id > 0 ? (
                              <TableCell>
                                <Icon
                                  Icon={DeleteIcon}
                                  color="#000000"
                                  onClick={() => {
                                    this.handleRemoveTier(index);
                                  }}
                                />
                              </TableCell>
                            ) : (
                              <TableCell />
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
              <FormItem.Error
                name="investmentTiers.tiers"
                errors={errors}
                touched={touched}
              />
            </FormItemGroup>
          </Box>
        )}
        <FieldArray
          name="investmentTiers.tiers"
          render={({ push, remove }) => (
            <Fragment>
              <Field
                name="investmentTiers.newTier"
                ticker={ticker}
                component={AddTierModal}
                title={`Add the Investment Tier #${value.tiers.length + 1}`}
                isOpen={isAddingTier}
                onAdd={push}
                onClose={this.handleCloseAddTier}
              />
              <RemoveTierModal
                tierIndex={this.state.removingTierIndex}
                onRemove={remove}
                onClose={this.handleCloseRemoveTier}
              />
            </Fragment>
          )}
        />
      </Fragment>
    );
  }
}
