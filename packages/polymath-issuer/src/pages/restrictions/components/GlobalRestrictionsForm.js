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
import { addDefaultRestriction } from '../../../actions/restrictions';
import {
  validateTodayOrAfter,
  validateStartTime,
  validateEndDate,
  validateEndTime,
  REQUIRED_MESSAGE,
  MORE_THAN_MESSAGE,
  ADDRESS_MESSAGE,
  MAX_DIGITS_MESSAGE,
} from '../../sto/components/ConfigureSTOForm/validators'; // this is mangled put into global object
import moment from 'moment';
import { toWei } from '../../../utils/contracts';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

const formSchema = validator.object().shape({
  date: validator.object().shape({
    startDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateStartDate', validateTodayOrAfter),
    startTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateStartTime', validateStartTime),
    endDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateEndDate', validateEndDate),
    endTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validEndTime', validateEndTime),
  }),
  token: validator
    .number()
    .when('transferType', {
      is: 'token',
      then: validator.number().isRequired(REQUIRED_MESSAGE),
    }),
  percentage: validator
    .number()
    .when('transferType', {
      is: 'percentage',
      then: validator.number().isRequired(REQUIRED_MESSAGE),
    }),
  intervalAmount: validator.number().isRequired(REQUIRED_MESSAGE),
});

const initialValues = {
  date: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  },
  intervalAmount: null,
  transferType: 'token',
  token: '',
  percentage: '',
  interval: 'days',
};

export const AddGlobalRestrictionsComponent = ({
  handleSubmit,
  handleClose,
  handleChange,
  values,
  setFieldValue,
  errors,
  touched,
  status,
}) => {
  const handleDropdown = e => {
    setFieldValue('interval', e.value);
  };
  console.log('test' + status);
  return (
    <Form className="global-restrictions" onSubmit={handleSubmit}>
      <Grid>
        <Grid.Row>
          <Grid.Col gridSpan={5}>
            <FormItem name="transferType">
              <FormItem.Label>
                <strong>Specify Maximum Transfer in</strong>
              </FormItem.Label>
              <FormItem.Input
                className="transfer-type"
                options={[
                  { label: 'Number of Tokens', value: 'token' },
                  { label: 'Percentage', value: 'percentage' },
                ]}
                component={RadioInput}
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
          <Grid.Col gridSpan={7}>
            {values.transferType === 'token' && (
              <FormItem name="token">
                <Heading className="form-header" variant="h3">
                  Maximum Trade Volume
                </Heading>
                <FormItem.Input
                  placeholder="Enter the value"
                  component={TextInput} // TODO: change to number input
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
          <Grid.Col gridSpan={12}>
            <label className="form-label">Rolling Period Interval</label>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row style={{ marginTop: '-20px' }}>
          <Grid.Col gridSpan={12}>
            <FormItemGroup>
              <FormItemGroup.Items>
                <FormItem name="intervalAmount">
                  {/* <FormItem.Label>Rolling Period Interval</FormItem.Label> */}
                  <FormItem.Input
                    component={NumberInput}
                    placeholder="Enter amount"
                    maxDecimals={0}
                    min={1}
                    max={365}
                  />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="interval">
                  <FormItem.Input
                    className="align-self-end"
                    component={Dropdown}
                    onChange={handleDropdown}
                    value={values.interval}
                  >
                    <DropdownItem value="days" itemText="Days" />
                    <DropdownItem value="months" itemText="months" />
                    <DropdownItem value="years" itemText="years" />
                  </FormItem.Input>
                </FormItem>
                {/* <Dropdown
                  className="time"
                  type="text"
                  name="time"
                  onChange={handleDropdown}
                  value={values.time}
                >
                  <DropdownItem value="days" itemText="Days" />
                  <DropdownItem value="weeks" itemText="Weeks" />
                </Dropdown> */}
              </FormItemGroup.Items>
            </FormItemGroup>
          </Grid.Col>
          <Grid.Col className="align-self-end" gripSpan={2} />
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
  displayName: 'GlobalRestrictionsForm',
  validateOnChange: false,
  mapPropsToStatus: props => {
    return {
      restrictionType: props.restrictionType,
    };
  },
  mapPropsToValues: () => {
    return {
      ...initialValues,
    };
  },
  handleSubmit: (values, { errors, setFieldError, props }) => {
    const { dispatch, handleClose } = props;
    const startsAt =
      moment(values.date.startDate).unix() * 1000 + values.date.startTime;
    const endsAt =
      moment(values.date.endDate).unix() * 1000 + values.date.endTime;
    const allowedTokens =
      values.transferType === 'token' ? values.token : toWei(values.percentage);
    const rollingPeriodInDays = 30;
    const restrictionType = {
      token: 0,
      percentage: 1,
    };
    handleClose();
    dispatch(
      addDefaultRestriction(
        allowedTokens,
        startsAt,
        rollingPeriodInDays,
        endsAt,
        restrictionType[values.transferType]
      )
    );
  },
});

const mapStateToProps = state => ({});

const FormikEnhancedForm = formikEnhancer(AddGlobalRestrictionsComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
