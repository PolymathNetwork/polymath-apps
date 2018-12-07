// @flow

import React, { Fragment } from 'react';
import { map, compact } from 'lodash';
import { Field, FieldArray } from 'formik';
import { Toggle, Button, Icon } from 'carbon-components-react';
import { iconAddSolid } from 'carbon-icons';
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
  tierData: any,
|};

class InvestmentTiers extends React.Component<Props, State> {
  state = {
    isAddingTier: false,
    tierData: {},
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

  handleClose = () => {
    this.setState({ tierData: {}, isAddingTier: false });
  };

  handleAddNewTier = (id, data) => {
    if (typeof id === 'number') {
      this.setState({ tierData: { id, ...data }, isAddingTier: true });
    } else {
      this.setState({ isAddingTier: true });
    }
  };

  render() {
    const {
      field: { value, name },
      form: { touched, errors },
      ticker,
    } = this.props;
    const { isAddingTier, tierData } = this.state;

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
                        {rows.map(row => (
                          <TableRow key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                            {row.id > 0 ? (
                              <TableCell>
                                <Icon
                                  name="icon--edit"
                                  onClick={() => {
                                    this.handleAddNewTier(
                                      row.id - 1,
                                      value.tiers[row.id - 1]
                                    );
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
          render={({ push, replace }) => (
            <Field
              name="investmentTiers.newTier"
              ticker={ticker}
              component={AddTierModal}
              title={
                tierData
                  ? `Edit Investment Tier`
                  : `Add the Investment Tier #${value.tiers.length + 1}`
              }
              isOpen={isAddingTier}
              tierData={Object.keys(tierData).length > 0 ? tierData : {}}
              onAdd={push}
              onUpdate={replace}
              onClose={this.handleClose}
            />
          )}
        />
      </Fragment>
    );
  }
}

export default InvestmentTiers;
