import React from 'react';
import { Form, Button } from 'carbon-components-react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import {
  Grid,
  FormItem,
  NumberInput,
  TextInput,
  RadioInput,
  ToggleInput,
  Tooltip,
} from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';

import { issue } from '../../../actions/token';

const requiredMessage = 'Required.';
const maxMessage = 'Must be ${max} characters or fewer.';
const urlMessage = 'Invalid URL (example: http(s)://www.example.com).';

const formSchema = validator.object().shape({
  name: validator
    .string()
    .isRequired(requiredMessage)
    .max(100, maxMessage),
  isDivisible: validator.string().isRequired(requiredMessage),
  limitInvestors: validator.boolean().isRequired(requiredMessage),
  investorsNumber: validator
    .bigNumber()
    .when('limitInvestors', (limitInvestors, schema) =>
      limitInvestors
        ? schema.isRequired(requiredMessage).moreThan(
            0,
            // eslint-disable-next-line no-template-curly-in-string
            'Must be higher than ${more}.'
          )
        : schema
    ),
  // eslint-disable-next-line no-template-curly-in-string
  details: validator
    .string()
    .isUrl(urlMessage)
    .max(100, 'Must be ${max} characters or fewer.'),
});

const initialValues = {
  name: '',
  isDivisible: 'divisible',
  limitInvestors: false,
  investorsNumber: null,
  details: '',
};

export const CompleteTokenFormComponent = ({ handleSubmit, values }) => (
  <Form onSubmit={handleSubmit} className="token-form">
    <Grid.Row>
      <Grid.Col gridSpan={[12, 12, 12, 5]}>
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
          <FormItem.Input
            component={TextInput}
            placeholder="Enter Token Name"
          />
          <FormItem.Error />
        </FormItem>
      </Grid.Col>
      <Grid.Col gridSpan={[12, 12, 12, 5]}>
        <FormItem name="isDivisible">
          <FormItem.Label>
            <Tooltip triggerText="My Security Token Must Be">
              <p>
                <strong>Divisible or Indivisible token</strong>
              </p>
              <p>
                Indivisible tokens are typically used to represent an equity,
                while divisible tokens may be used to represent divisible assets
                such as bonds. Please connect with your advisor to select the
                best option.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input
            options={[
              { label: 'Divisible', value: 'divisible' },
              { label: 'Indivisible', value: 'indivisible' },
            ]}
            component={RadioInput}
          />
          <FormItem.Error />
        </FormItem>
      </Grid.Col>
      <Grid.Col gridSpan={[12, 12, 12, 7]}>
        <FormItem name="details">
          <FormItem.Label>
            <Tooltip triggerText="Additional Token Information">
              <p>
                <strong>Additional Token Information</strong>
              </p>
              <p>
                Paste link to a shared file or folder that includes additional
                information on your token, such as legend.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input component={TextInput} placeholder="Paste link here" />
          <FormItem.Error />
        </FormItem>
      </Grid.Col>
      <Grid.Col gridSpan={[12, 12, 12, 5]}>
        <FormItem name="limitInvestors">
          <FormItem.Label>
            <Tooltip triggerText="Limit the Number of Investors Who Can Hold This Token">
              <p>
                <strong>Limit the Number of Investors</strong>
              </p>
              <p>
                This option allows you to limit the number of concurrent token
                holders irrespective of the number of entries in the whitelist.
                <br />
                For example, enabling this option can allow you to allow a
                maximum of 99 concurrent token holders while your whitelist may
                have thousands of entries.
              </p>
            </Tooltip>
          </FormItem.Label>
          <FormItem.Input component={ToggleInput} />
          <FormItem.Error />
        </FormItem>
      </Grid.Col>
      <Grid.Col gridSpan={[12, 12, 12, 7]}>
        {values.limitInvestors ? (
          <FormItem name="investorsNumber">
            <FormItem.Label>Max. Number of Investors</FormItem.Label>
            <FormItem.Input
              component={NumberInput}
              placeholder="Enter the number"
              maxDecimals={0}
              useBigNumbers
            />
            <FormItem.Error />
          </FormItem>
        ) : null}
      </Grid.Col>
    </Grid.Row>
    <Button type="submit">Create my security token</Button>
  </Form>
);

const mapStateToProps = ({ token: { token } }) => ({ token });

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'CompleteTokenForm',
  validateOnChange: false,
  mapPropsToValues: ({ token }) => {
    const { ticker, name } = token;

    return {
      ticker,
      name,
      ...initialValues,
    };
  },
  handleSubmit: (values, { props }) => {
    const { dispatch } = props;
    const { isDivisible, ...rest } = values;

    const sanitizedValues = {
      isDivisible: isDivisible === 'divisible',
      ...rest,
    };

    dispatch(issue(sanitizedValues));
  },
});

const FormikEnhancedForm = formikEnhancer(CompleteTokenFormComponent);
export default connect(mapStateToProps)(FormikEnhancedForm);
