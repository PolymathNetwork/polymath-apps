// @flow

import React, { Component, Fragment } from 'react';
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
import { addManualApproval } from '../../../actions/compliance';
import {
  validateTodayOrAfter,
  validateDays,
  validateExpiryTime,
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
    expiryDate: validator
      .date()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateExpiryDate', validateTodayOrAfter),
    expiryTime: validator
      .number()
      .isRequired(REQUIRED_MESSAGE)
      .test('validateExpiryTime', validateExpiryTime),
  }),
  fromAddress: validator
    .string()
    .isRequired(REQUIRED_MESSAGE)
    .isAddress(ADDRESS_MESSAGE),
  toAddress: validator
    .string()
    .isRequired(REQUIRED_MESSAGE)
    .notOneOf(
      [validator.ref('fromAddress')],
      'To Address must be different than From Address'
    )
    .isAddress(ADDRESS_MESSAGE),
  token: validator
    .number()
    .moreThan(0, MORE_THAN_MESSAGE)
    .isRequired(REQUIRED_MESSAGE),
  description: validator.string().isRequired(REQUIRED_MESSAGE),
});

const initialValues = {
  date: {
    startDate: null,
    startTime: null,
  },
  fromAddress: '',
  toAddress: '',
  token: null,
  description: '',
};

export const AddApprovalComponent = ({
  handleSubmit,
  handleClose,
  handleChange,
  values,
  setFieldValue,
  errors,
  touched,
}) => {
  return (
    <Form className="global-restrictions" onSubmit={handleSubmit}>
      <Grid>
        <Grid.Row>
          <Grid.Col gridSpan={12}>
            <FormItem name="token">
              <FormItem.Label>
                <strong>Allow Transfer of</strong>
              </FormItem.Label>
              <FormItem.Input
                placeholder="Enter amount"
                min={1}
                component={NumberInput}
                unit="TOKENS"
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={12}>
            <FormItem name="fromAddress">
              <FormItem.Label>
                <strong>From Investor Wallet Address</strong>
              </FormItem.Label>
              <FormItem.Input
                component={TextInput}
                placeholder="Enter wallet address"
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={12}>
            <FormItem name="toAddress">
              <FormItem.Label>
                <strong>To Investor Wallet Address</strong>
              </FormItem.Label>
              <FormItem.Input
                component={TextInput}
                placeholder="Enter wallet Address"
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col gridSpan={12}>
            <FormItemGroup>
              <FormItemGroup.Items>
                <FormItem name="date.expiryDate">
                  <FormItem.Label>Expiry Date</FormItem.Label>
                  <FormItem.Input
                    component={DatePickerInput}
                    placeholder="mm / dd / yyyy"
                  />
                </FormItem>
                <FormItem name="date.expiryTime">
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
          <Grid.Col gridSpan={12}>
            <FormItem name="description">
              <FormItem.Label>
                <strong>Description</strong>
              </FormItem.Label>
              <FormItem.Input
                component={TextInput}
                maxLength={32}
                placeholder="Start text here(up to 32 characters)"
              />
              <FormItem.Error />
            </FormItem>
          </Grid.Col>
        </Grid.Row>
      </Grid>
      <Modal.Footer>
        <Button kind="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit">Confirm</Button>
      </Modal.Footer>
    </Form>
  );
};

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'AddApprovalForm',
  validateOnChange: false,
  mapPropsToValues: props => {
    return {
      ...initialValues,
    };
  },
  handleSubmit: (values, { errors, setFieldError, props }) => {
    const { dispatch, handleClose, approvals } = props;
    const approvalExists = approvals.find(
      i =>
        i.fromAddress === values.fromAddress &&
        i.toAddress === values.toAddress &&
        i.expiry * 1000 > Date.now()
    );

    if (approvalExists) {
      setFieldError(
        'toAddress',
        'An approval with both addresses already exists'
      );
      setFieldError(
        'fromAddress',
        'An approval with both addresses already exists'
      );
      return;
    }
    const startsAt =
      moment(values.date.expiryDate).unix() * 1000 + values.date.expiryTime;

    dispatch(
      addManualApproval(
        values.fromAddress,
        values.toAddress,
        toWei(values.token),
        startsAt,
        values.description
      )
    );

    handleClose();
  },
});

const mapStateToProps = state => ({
  approvals: state.whitelist.approvals,
});

const FormikEnhancedForm = formikEnhancer(AddApprovalComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
