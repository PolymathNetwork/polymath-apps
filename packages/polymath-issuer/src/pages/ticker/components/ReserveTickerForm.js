/* eslint-disable jsx-a11y/anchor-is-valid, jsx-a11y/href-no-hash */

import React from 'react';

import { Form, Button } from 'carbon-components-react';
import { FormItem, TextInput, Tooltip, Grid } from '@polymathnetwork/ui';
import { reserve } from '../../../actions/ticker';

import { connect } from 'react-redux';
import { withFormik } from 'formik';
import validator from '@polymathnetwork/ui/validator';
import { SecurityTokenRegistry } from '@polymathnetwork/js';

const requiredMessage = 'Required.';
// eslint-disable-next-line no-template-curly-in-string
const maxMessage = 'Must be ${max} characters or fewer.';

const formSchema = validator.object().shape({
  ticker: validator
    .string()
    .isRequired(requiredMessage)
    .max(10, maxMessage)
    .matches(
      /^[a-z0-9.-]+$/i,
      'Only alphanumeric characters, hyphens and periods are allowed.'
    )
    .matches(/^[a-z0-9].*/i, 'Ticker must start with a letter or number.')
    .matches(/.*[a-z0-9]$/i, 'Ticker must end with a letter or number.')
    .matches(
      /^(?!.*\.\.)(?!.*\.\-)(?!.*-\.)(?!.*--).*$/i,
      'Ticker must not contain 2 special characters together.'
    )
    .test('isNotReserved', async function(value) {
      let details;
      try {
        details = await SecurityTokenRegistry.getTickerDetails(value);
      } catch (err) {
        return this.createError({
          message: 'Network error. Please try again later.',
        });
      }

      if (details !== null) {
        return this.createError({
          message: 'Specified ticker already exists.',
        });
      }

      return true;
    }),
  name: validator
    .string()
    .isRequired(requiredMessage)
    .max(100, maxMessage),
  owner: validator
    .string()
    .isRequired(requiredMessage)
    .isAddress('Invalid address.'),
});

export const ReserveTickerFormComponent = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Grid>
      <div className="ticker-field">
        <FormItem name="ticker">
          <FormItem.Label>Enter Token Symbol</FormItem.Label>
          <FormItem.Input
            component={TextInput}
            placeholder="Up to 10 characters (example: TORO-A)"
          />
          <FormItem.Error />
        </FormItem>
      </div>

      <FormItem name="name">
        <FormItem.Label>
          <Tooltip triggerText="Token Name">
            <p>
              <strong>Token Name</strong>
            </p>
            <p>
              This is the name of your token for display purposes.
              <br />
              For example: Toro Token
            </p>
          </Tooltip>
        </FormItem.Label>
        <FormItem.Input component={TextInput} placeholder="Enter Token Name" />
        <FormItem.Error />
      </FormItem>

      <FormItem name="owner">
        <FormItem.Label>
          <Tooltip triggerText="Issuer's ETH Address">
            <p>
              <strong>Issuer&apos;s ETH Address</strong>
            </p>
            <p>
              This ETH address was read from your MetaMask. Only this account
              will be able to access dashboard and complete token issuance and
              STO.
            </p>
          </Tooltip>
        </FormItem.Label>
        <FormItem.Input component={TextInput} disabled />
        <FormItem.Error />
      </FormItem>
    </Grid>
    <Button type="submit">Reserve token symbol</Button>
    <p className="pui-input-hint">
      By registering your token symbol with Polymath you agree to our&nbsp;
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://polymath.network/termsofservice.html"
      >
        Terms and Conditions.
      </a>
    </p>
  </Form>
);

const mapStateToProps = ({ network: { account } }) => ({ account });

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'ReserveTickerForm',
  validateOnChange: false,
  mapPropsToValues: ({ account }) => {
    return {
      ticker: '',
      name: '',
      owner: account,
    };
  },
  handleSubmit: (values, { props }) => {
    const { dispatch } = props;
    const formattedValues = { ...values, ticker: values.ticker.toUpperCase() };
    dispatch(reserve(formattedValues));
  },
});

const FormikEnhancedForm = formikEnhancer(ReserveTickerFormComponent);
export default connect(mapStateToProps)(FormikEnhancedForm);
