// @flow

import React, { Component, useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from '@polymathnetwork/ui';
import { withFormik } from 'formik';
import { Form, Dropdown, DropdownItem } from 'carbon-components-react';
import { RESTRICTION_TYPE } from '../../../constants';
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
import {
  addDefaultRestriction,
  addDefaultDailyRestriction,
  modifyDefaultDailyRestriction,
  modifyDefaultRestriction,
} from '../../../actions/restrictions';
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
    startDate: validator.date().isRequired(REQUIRED_MESSAGE),
    startTime: validator.number().isRequired(REQUIRED_MESSAGE),
    endDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateEndDate', validateEndDate),
    endTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validEndTime', validateEndTime),
  }),
  token: validator.number().when('transferType', {
    is: 'token',
    then: validator.number().isRequired(REQUIRED_MESSAGE),
  }),
  percentage: validator.number().when('transferType', {
    is: 'percentage',
    then: validator.number().isRequired(REQUIRED_MESSAGE),
  }),
  intervalAmount: validator
    .number()
    .when('restrictionType', {
      is: 'custom',
      then: validator.number().isRequired(REQUIRED_MESSAGE),
    })
    .when('restrictionType', {
      is: '24h',
      then: validator.number().nullable(),
    }),
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
  token: null,
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
}) => {
  const handleDropdown = e => {
    setFieldValue('interval', e.value);
  };
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
                  component={NumberInput}
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
        {values.restrictionType === 'custom' && (
          <Fragment>
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
                        ariaLabel="Rolling Period Interval"
                      >
                        <DropdownItem value="days" itemText="Days" />
                        <DropdownItem value="months" itemText="Months" />
                        <DropdownItem value="years" itemText="Years" />
                      </FormItem.Input>
                    </FormItem>
                  </FormItemGroup.Items>
                </FormItemGroup>
              </Grid.Col>
              <Grid.Col className="align-self-end" gripSpan={2} />
            </Grid.Row>
          </Fragment>
        )}
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
          <Grid.Col gridSpan={4} />
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
  mapPropsToValues: props => {
    if (
      props.restrictionType === 'custom' &&
      props.defaultRestrictionModified
    ) {
      let startTime =
        props.defaultRestriction.startTime.unix() -
        moment(props.defaultRestriction.startTime)
          .startOf('day')
          .unix();
      let endTime =
        props.defaultRestriction.endTime.unix() -
        moment(props.defaultRestriction.endTime)
          .startOf('day')
          .unix();
      return {
        date: {
          startDate: props.defaultRestriction.startTime,
          startTime: startTime * 1000,
          endDate: props.defaultRestriction.endTime,
          endTime: endTime * 1000,
        },
        intervalAmount: props.defaultRestriction.rollingPeriodInDays,
        transferType:
          props.defaultRestriction.restrictionType === 1
            ? 'percentage'
            : 'token',
        token:
          props.defaultRestriction.restrictionType === 0
            ? parseFloat(props.defaultRestriction.allowedTokens)
            : '',
        percentage:
          props.defaultRestriction.restrictionType === 1
            ? parseFloat(props.defaultRestriction.allowedTokens)
            : '',
        interval: 'days',
        restrictionType: props.restrictionType,
      };
    } else if (
      props.restrictionType === '24h' &&
      props.dailyRestrictionModified
    ) {
      let startTime =
        props.dailyRestriction.startTime.unix() -
        moment(props.dailyRestriction.startTime)
          .startOf('day')
          .unix();
      let endTime =
        props.dailyRestriction.endTime.unix() -
        moment(props.dailyRestriction.endTime)
          .startOf('day')
          .unix();
      return {
        date: {
          startDate: props.dailyRestriction.startTime,
          startTime: startTime * 1000,
          endDate: props.dailyRestriction.endTime,
          endTime: endTime * 1000,
        },
        transferType:
          props.dailyRestriction.restrictionType === 1 ? 'percentage' : 'token',
        token:
          props.dailyRestriction.restrictionType === 0
            ? parseFloat(props.dailyRestriction.allowedTokens)
            : '',
        percentage:
          props.dailyRestriction.restrictionType === 1
            ? parseFloat(props.dailyRestriction.allowedTokens)
            : '',
        restrictionType: props.restrictionType,
      };
    }
    return {
      ...initialValues,
      restrictionType: props.restrictionType,
    };
  },
  handleSubmit: (values, { errors, setFieldError, props }) => {
    const {
      dispatch,
      handleClose,
      dailyRestrictionModified,
      defaultRestrictionModified,
    } = props;
    const startsAt =
      moment(values.date.startDate).unix() * 1000 + values.date.startTime;
    const endsAt =
      moment(values.date.endDate).unix() * 1000 + values.date.endTime;
    const allowedTokens =
      values.transferType === 'token'
        ? toWei(values.token)
        : toWei(values.percentage);
    let rollingPeriodInDays;

    switch (values.interval) {
      case 'months':
        rollingPeriodInDays = values.intervalAmount * 30;
        break;
      case 'years':
        rollingPeriodInDays = values.intervalAmount * 365;
        break;
      default:
        rollingPeriodInDays = values.intervalAmount;
        break;
    }

    handleClose();

    if (values.restrictionType === '24h') {
      if (!dailyRestrictionModified) {
        dispatch(
          addDefaultDailyRestriction(
            allowedTokens,
            startsAt,
            endsAt,
            RESTRICTION_TYPE[values.transferType]
          )
        );
      } else {
        dispatch(
          modifyDefaultDailyRestriction(
            allowedTokens,
            startsAt,
            endsAt,
            RESTRICTION_TYPE[values.transferType]
          )
        );
      }
    } else {
      if (!defaultRestrictionModified) {
        dispatch(
          addDefaultRestriction(
            allowedTokens,
            startsAt,
            rollingPeriodInDays,
            endsAt,
            RESTRICTION_TYPE[values.transferType]
          )
        );
      } else {
        dispatch(
          modifyDefaultRestriction(
            allowedTokens,
            startsAt,
            rollingPeriodInDays,
            endsAt,
            RESTRICTION_TYPE[values.transferType]
          )
        );
      }
    }
  },
});

const mapStateToProps = state => ({
  dailyRestrictionModified: state.restrictions.dailyRestrictionModified,
  defaultRestrictionModified: state.restrictions.defaultRestrictionModified,
  dailyRestriction: state.restrictions.dailyRestriction,
  defaultRestriction: state.restrictions.defaultRestriction,
});

const FormikEnhancedForm = formikEnhancer(AddGlobalRestrictionsComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
