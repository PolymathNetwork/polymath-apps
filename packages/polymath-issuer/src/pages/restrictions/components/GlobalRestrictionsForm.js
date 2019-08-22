// @flow

import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from '@polymathnetwork/ui';
import { withFormik } from 'formik';
import { Form, Dropdown } from 'carbon-components-react';
import {
  bull,
  PageCentered,
  ContentBox,
  Heading,
  FormItem,
  TextInput,
  RadioInput,
  PercentageInput,
  NumberInput,
  Grid,
} from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

const formSchema = validator.object().shape({
  address: validator
    .string()
    .isAddress('Invalid Address')
    .isRequired('Required'),
  details: validator.string().isRequired('Required'),
});

const handleTransferTypeChange = value => {
  console.log(value);
};

const initialValues = {
  transferType: 'token',
};

const stringItems = ['Option 1', 'Option 2', 'Option 3'];

const items = [
  {
    id: 'option-1',
    text: 'Option 1',
  },
  {
    id: 'option-2',
    text: 'Option 2',
  },
  {
    id: 'option-3',
    text: 'Option 3',
  },
  {
    id: 'option-4',
    text: 'Option 4',
  },
];

export const AddGlobalRestrictionsComponent = ({
  handleSubmit,
  handleClose,
  values,
}) => {
  return (
    <Form className="global-restrictions" onSubmit={handleSubmit}>
      <Grid>
        <Grid.Row>
          <Grid.Col gridSpan={3}>
            <FormItem name="transferType">
              <FormItem.Label>
                <strong>Specify Maximum Transfer in</strong>
              </FormItem.Label>
              <FormItem.Input
                options={[
                  { label: 'Number of Tokens', value: 'token' },
                  { label: 'Percentage', value: 'percentage' },
                ]}
                component={RadioInput}
                handleChange={handleTransferTypeChange}
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
          <Grid.Col gridSpan={9}>
            {values.transferType === 'token' && (
              <FormItem name="token">
                <Heading className="form-header" variant="h3">
                  Maximum Trade Volume
                </Heading>
                <FormItem.Input
                  placeholder="Enter the value"
                  component={TextInput}
                  unit="TOKEN"
                />
                <FormItem.Error />
              </FormItem>
            )}
            {values.transferType === 'percentage' && (
              <FormItem name="percentage">
                <Heading className="form-header" variant="h3">
                  Maximum Trade Volume
                </Heading>
                <FormItem.Input
                  placeholder="Enter the value"
                  component={PercentageInput}
                  unit="%"
                />
                <FormItem.Error />
              </FormItem>
            )}
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={1}>
            <FormItem name="cap">
              <FormItem.Label>Rolling Period Interval</FormItem.Label>
              <FormItem.Input
                component={NumberInput}
                placeholder="Enter amount"
                maxDecimals={0}
                max={365}
              />
              <FormItem.Error />
              <Grid.Col gripSpan={2}>
                <FormItem name="time">
                  <FormItem.Input
                    component={Dropdown}
                    items={[
                      {
                        id: 'option-1',
                        text: 'Option 1',
                      },
                    ]}
                  />
                </FormItem>
              </Grid.Col>
            </FormItem>
          </Grid.Col>
        </Grid.Row>
      </Grid>
      <Modal.Footer>
        <Button onClick={handleClose} className="cancel-btn" kind="secondary">
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </Modal.Footer>
    </Form>
  );
};

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'ConfirmEmailForm',
  validateOnChange: false,
  mapPropsToValues: () => {
    return {
      ...initialValues,
    };
  },
  handleSubmit: (values, { setFieldError, props }) => {
    const { dispatch, approvedManagers } = props;
    const addressExists = approvedManagers.find(
      i => i.address === values.address
    );
    if (addressExists) {
      setFieldError('address', 'Address is already added to Whitelist Manager');
      return;
    }
    props.handleClose();
    dispatch(addAddressToTransferManager(values.address, values.details));
  },
});

const mapStateToProps = state => ({});

const FormikEnhancedForm = formikEnhancer(AddGlobalRestrictionsComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

class GlobalRestrictionsForm extends Component<Props> {
  render() {
    return <ConnectedForm />;
  }
}

export default GlobalRestrictionsForm;
