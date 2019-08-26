// @flow

import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from '@polymathnetwork/ui';
import { withFormik } from 'formik';
import { Form, Dropdown, DropdownItem } from 'carbon-components-react';
import {
  bull,
  Box,
  PageCentered,
  ContentBox,
  Heading,
  FormItem,
  TextInput,
  RadioInput,
  PercentageInput,
  NumberInput,
  Grid,
  FormItemGroup,
  DatePickerInput,
  TimePickerSelect,
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
  token: '',
  percentage: '',
  time: 'days',
};

export const AddGlobalRestrictionsComponent = ({
  handleSubmit,
  handleClose,
  handleChange,
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  const handleDropdown = e => {
    setFieldValue('time', e.value);
  };
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
          <Grid.Col gridSpan={6}>
            {values.transferType === 'token' && (
              <FormItem name="token">
                <Heading className="form-header" variant="h3">
                  Maximum Trade Volume
                </Heading>
                <FormItem.Input
                  placeholder="Enter the value"
                  component={TextInput} // change to number input
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
            </FormItem>
          </Grid.Col>
          <Grid.Col className="align-self-end" gripSpan={2}>
            <Dropdown
              className="time"
              type="text"
              name="time"
              onChange={handleDropdown}
              value={values.time}
            >
              <DropdownItem value="days" itemText="Days" />
              <DropdownItem value="weeks" itemText="Weeks" />
            </Dropdown>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={12}>
            <FormItemGroup>
              <FormItemGroup.Items>
                <FormItem name="date.startDate">
                  <FormItem.Label>Start Date</FormItem.Label>
                  <FormItem.Input
                    component={DatePickerInput}
                    placeholder="mm / dd / yyyy"
                  />
                </FormItem>
                <FormItem name="date.startTime">
                  <FormItem.Label>Time</FormItem.Label>
                  <FormItem.Input
                    component={TimePickerSelect}
                    placeholder="hh:mm"
                  />
                </FormItem>
                <FormItem name="date.endDate">
                  <FormItem.Label>End Date</FormItem.Label>
                  <FormItem.Input
                    component={DatePickerInput}
                    placeholder="mm / dd / yyyy"
                  />
                </FormItem>
                <FormItem name="date.endTime">
                  <FormItem.Label>Time</FormItem.Label>
                  <FormItem.Input
                    component={TimePickerSelect}
                    placeholder="hh:mm"
                  />
                </FormItem>
              </FormItemGroup.Items>
              <FormItemGroup.Error
                name="date"
                errors={errors}
                touched={touched}
              />
            </FormItemGroup>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={4}>
            <div>Placeholder for that line</div>
          </Grid.Col>
        </Grid.Row>
      </Grid>
      <Button type="submit">Set The Period</Button>
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
