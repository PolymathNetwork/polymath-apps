// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from '@polymathnetwork/ui';
import { withFormik } from 'formik';
import {
  Form,
  Dropdown,
  DropdownItem,
  Checkbox,
} from 'carbon-components-react';
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
  addIndividualRestriction,
  individualRestrictionModified,
  setIsCustomRestriction,
  setIsDailyRestriction,
} from '../../../actions/restrictions';
import {
  validateTodayOrAfter,
  validateIndividualDays,
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
import web3 from 'web3';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

const customFormSchema = validator.object().shape({
  address: validator.string().isRequired(REQUIRED_MESSAGE),
  customDate: validator.object().shape({
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
  customToken: validator
    .number()
    .nullable()
    .when('customTransferType', {
      is: 'token',
      then: validator.number().isRequired(REQUIRED_MESSAGE),
    }),
  customPercentage: validator.number().when('customTransferType', {
    is: 'percentage',
    then: validator.number().isRequired(REQUIRED_MESSAGE),
  }),
  intervalAmount: validator
    .number()
    .isRequired(REQUIRED_MESSAGE)
    .test('validateIndividualDays', validateIndividualDays),
});

const dailyFormSchema = validator.object().shape({
  address: validator.string().isRequired(REQUIRED_MESSAGE),
  dailyDate: validator.object().shape({
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
  dailyToken: validator
    .number()
    .nullable()
    .when('dailyTransferType', {
      is: 'token',
      then: validator.number().isRequired(REQUIRED_MESSAGE),
    }),
  dailyPercentage: validator.number().when('dailyTransferType', {
    is: 'percentage',
    then: validator.number().isRequired(REQUIRED_MESSAGE),
  }),
});

const initialValues = {
  address: null,
  dailyRestriction: false,
  customRestriction: false,
  dailyDate: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  },
  customDate: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
  },
  dailyTransferType: 'token',
  dailyToken: null,
  dailyPercentage: '',
  customTransferType: 'token',
  customToken: null,
  customPercentage: '',
  interval: 'days',
  intervalAmount: null,
};

class AddIndividualRestriction extends Component {
  componentDidMount() {
    const { dispatch, values } = this.props;
    dispatch(setIsCustomRestriction(values.customRestriction));
    dispatch(setIsDailyRestriction(values.dailyRestriction));
  }
  handleDailyRestriction = e => {
    const { setFieldValue, values, dispatch } = this.props;
    setFieldValue('dailyRestriction', !values.dailyRestriction);
    dispatch(setIsDailyRestriction(!values.dailyRestriction));
  };

  handleCustomRestriction = e => {
    const { setFieldValue, values, dispatch } = this.props;
    setFieldValue('customRestriction', !values.customRestriction);
    dispatch(setIsCustomRestriction(!values.customRestriction));
  };

  handleDropdown = e => {
    const { setFieldValue } = this.props;
    setFieldValue('interval', e.value);
  };

  render() {
    const {
      handleSubmit,
      handleClose,
      handleChange,
      values,
      setFieldValue,
      errors,
      touched,
    } = this.props;
    return (
      <Form className="global-restrictions" onSubmit={handleSubmit}>
        <Grid>
          <Grid.Row>
            <Grid.Col gridSpan={5}>
              <FormItem name="address">
                <FormItem.Label>
                  <strong>Investor Wallet Address</strong>
                </FormItem.Label>
                <FormItem.Input
                  component={TextInput}
                  placeholder="Wallet Address"
                />
                <FormItem.Error />
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col gridSpan={6}>
              <Checkbox
                id="daily-restriction"
                onClick={this.handleDailyRestriction}
                checked={values.dailyRestriction}
                disabled={values.dailyModified}
                labelText="Set a 24h Rolling Period Restriction"
              />
              <Checkbox
                id="custom-restriction"
                onClick={this.handleCustomRestriction}
                checked={values.customRestriction}
                disabled={values.customModified}
                labelText="Set a Custom Rolling Period Restriction"
              />
            </Grid.Col>
          </Grid.Row>
          {values.dailyRestriction && (
            <Fragment>
              <Grid.Row>
                <Grid.Col gridSpan={12}>
                  <Heading variant="h3">24h Rolling Period Settings</Heading>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col gridSpan={5}>
                  <FormItem name="dailyTransferType">
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
                  {values.dailyTransferType === 'token' && (
                    <FormItem name="dailyToken">
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
                  {values.dailyTransferType === 'percentage' && (
                    <FormItem name="dailyPercentage">
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
                  <FormItemGroup>
                    <FormItemGroup.Items>
                      <FormItem name="dailyDate.startDate">
                        <FormItem.Label>Start Date</FormItem.Label>
                        <FormItem.Input
                          component={DatePickerInput}
                          placeholder="mm / dd / yyyy"
                        />
                      </FormItem>
                      <FormItem name="dailyDate.startTime">
                        <FormItem.Label>Time</FormItem.Label>
                        <FormItem.Input
                          component={TimePickerSelect}
                          placeholder="hh:mm"
                        />
                      </FormItem>
                      <FormItem name="dailyDate.endDate">
                        <FormItem.Label>End Date</FormItem.Label>
                        <FormItem.Input
                          component={DatePickerInput}
                          placeholder="mm / dd / yyyy"
                        />
                      </FormItem>
                      <FormItem name="dailyDate.endTime">
                        <FormItem.Label>Time</FormItem.Label>
                        <FormItem.Input
                          component={TimePickerSelect}
                          placeholder="hh:mm"
                        />
                      </FormItem>
                    </FormItemGroup.Items>
                    <FormItemGroup.Error
                      name="dailyDate"
                      errors={errors}
                      touched={touched}
                    />
                  </FormItemGroup>
                </Grid.Col>
              </Grid.Row>
            </Fragment>
          )}
          {values.customRestriction && (
            <Fragment>
              <Grid.Row>
                <Grid.Col gridSpan={12}>
                  <Heading variant="h3">Custom Rolling Period Settings</Heading>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col gridSpan={5}>
                  <FormItem name="customTransferType">
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
                  {values.customTransferType === 'token' && (
                    <FormItem name="customToken">
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
                  {values.customTransferType === 'percentage' && (
                    <FormItem name="customPercentage">
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
              <Fragment>
                <Grid.Row>
                  <Grid.Col gridSpan={12}>
                    <label className="form-label">
                      Rolling Period Interval
                    </label>
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
                            disabled={true}
                            component={Dropdown}
                            onChange={this.handleDropdown}
                            value={values.interval}
                            ariaLabel="Rolling Period Interval"
                          >
                            <DropdownItem value="days" itemText="Days" />
                          </FormItem.Input>
                        </FormItem>
                      </FormItemGroup.Items>
                    </FormItemGroup>
                  </Grid.Col>
                  <Grid.Col className="align-self-end" gripSpan={2} />
                </Grid.Row>
              </Fragment>
              <Grid.Row>
                <Grid.Col gridSpan={12}>
                  <FormItemGroup>
                    <FormItemGroup.Items>
                      <FormItem name="customDate.startDate">
                        <FormItem.Label>Start Date</FormItem.Label>
                        <FormItem.Input
                          component={DatePickerInput}
                          placeholder="mm / dd / yyyy"
                        />
                      </FormItem>
                      <FormItem name="customDate.startTime">
                        <FormItem.Label>Time</FormItem.Label>
                        <FormItem.Input
                          component={TimePickerSelect}
                          placeholder="hh:mm"
                        />
                      </FormItem>
                      <FormItem name="customDate.endDate">
                        <FormItem.Label>End Date</FormItem.Label>
                        <FormItem.Input
                          component={DatePickerInput}
                          placeholder="mm / dd / yyyy"
                        />
                      </FormItem>
                      <FormItem name="customDate.endTime">
                        <FormItem.Label>Time</FormItem.Label>
                        <FormItem.Input
                          component={TimePickerSelect}
                          placeholder="hh:mm"
                        />
                      </FormItem>
                    </FormItemGroup.Items>
                    <FormItemGroup.Error
                      name="customDate"
                      errors={errors}
                      touched={touched}
                    />
                  </FormItemGroup>
                </Grid.Col>
              </Grid.Row>
            </Fragment>
          )}
        </Grid>
        <Modal.Footer>
          <Button
            disabled={!values.dailyRestriction && !values.customRestriction}
            type="submit"
          >
            Set The Period
          </Button>
        </Modal.Footer>
      </Form>
    );
  }
}

const formikEnhancer = withFormik({
  validationSchema: props => {
    if (props.isDailyRestriction && props.isCustomRestriction) {
      return dailyFormSchema.concat(customFormSchema);
    } else if (props.isDailyRestriction) {
      return dailyFormSchema;
    } else if (props.isCustomRestriction) {
      return customFormSchema;
    }
  },
  displayName: 'IndividualRestrictionsForm',
  validateOnChange: false,
  mapPropsToValues: props => {
    if (props.individualRestriction !== null) {
      let dailyStartTime =
        props.individualRestriction.dailyStartTime -
        moment
          .unix(props.individualRestriction.dailyStartTime)
          .startOf('day')
          .unix();
      let dailyEndTime =
        props.individualRestriction.dailyEndTime -
        moment
          .unix(props.individualRestriction.dailyEndTime)
          .startOf('day')
          .unix();
      let customStartTime =
        props.individualRestriction.customStartTime -
        moment
          .unix(props.individualRestriction.customStartTime)
          .startOf('day')
          .unix();
      let customEndTime =
        props.individualRestriction.customEndTime -
        moment
          .unix(props.individualRestriction.customEndTime)
          .startOf('day')
          .unix();
      return {
        dailyModified: props.individualRestriction ? true : false,
        customModified: props.individualRestriction ? true : false,
        address: props.individualRestriction.address,
        dailyDate: {
          startDate: props.individualRestriction.dailyStartTime
            ? moment
                .unix(props.individualRestriction.dailyStartTime)
                .startOf('day')
            : null,
          startTime: dailyStartTime * 1000,
          endDate: props.individualRestriction.dailyStartTime
            ? moment
                .unix(props.individualRestriction.dailyEndTime)
                .startOf('day')
            : null,
          endTime: dailyEndTime * 1000,
        },
        customDate: {
          startDate: props.individualRestriction.customStartTime
            ? moment
                .unix(props.individualRestriction.customStartTime)
                .startOf('day')
            : null,
          startTime: customStartTime * 1000,
          endDate: props.individualRestriction.customStartTime
            ? moment
                .unix(props.individualRestriction.customEndTime)
                .startOf('day')
            : null,
          endTime: customEndTime * 1000,
        },
        dailyRestriction: props.individualRestriction.dailyAllowedTokens
          ? true
          : false,
        customRestriction: props.individualRestriction.customAllowedTokens
          ? true
          : false,
        dailyTransferType:
          props.individualRestriction.dailyRestrictionType == 1
            ? 'percentage'
            : 'token',
        dailyToken:
          props.individualRestriction.dailyRestrictionType == 0
            ? parseFloat(props.individualRestriction.dailyAllowedTokens)
            : null,
        dailyPercentage:
          props.individualRestriction.dailyRestrictionType == 1
            ? parseFloat(props.individualRestriction.dailyAllowedTokens)
            : '',
        customTransferType:
          props.individualRestriction.customRestrictionType == 1
            ? 'percentage'
            : 'token',
        customToken:
          props.individualRestriction.customRestrictionType == 0
            ? parseFloat(props.individualRestriction.customAllowedTokens)
            : null,
        customPercentage:
          props.individualRestriction.customRestrictionType == 1
            ? parseFloat(props.individualRestriction.customAllowedTokens)
            : '',
        customRestrictionType:
          props.individualRestriction.customRestrictionType == 1
            ? 'percentage'
            : 'token',
        interval: 'days',
        intervalAmount: props.individualRestriction.rollingPeriodInDays,
      };
    }

    return {
      ...initialValues,
      restrictionType: props.restrictionType,
    };
  },
  handleSubmit: (values, { errors, setFieldError, props }) => {
    const { dispatch, handleClose } = props;
    const dailyRestriction = {};
    const customRestriction = {};

    if (values.dailyRestriction) {
      dailyRestriction.startTime =
        moment(values.dailyDate.startDate).unix() * 1000 +
        values.dailyDate.startTime;
      dailyRestriction.endTime =
        moment(values.dailyDate.endDate).unix() * 1000 +
        values.dailyDate.endTime;
      dailyRestriction.allowedTokens =
        values.dailyTransferType === 'token'
          ? toWei(values.dailyToken)
          : toWei(values.dailyPercentage);
      dailyRestriction.address = values.address;
      dailyRestriction.restrictionType =
        RESTRICTION_TYPE[values.dailyTransferType];
    }

    if (values.customRestriction) {
      customRestriction.startTime =
        moment(values.customDate.startDate).unix() * 1000 +
        values.customDate.startTime;
      customRestriction.endTime =
        moment(values.customDate.endDate).unix() * 1000 +
        values.customDate.endTime;
      customRestriction.allowedTokens =
        values.customTransferType === 'token'
          ? toWei(values.customToken)
          : toWei(values.customPercentage);
      customRestriction.address = values.address;
      customRestriction.restrictionType =
        RESTRICTION_TYPE[values.customTransferType];
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
      customRestriction.rollingPeriodInDays = rollingPeriodInDays;
    }
    if (props.individualRestriction) {
      dispatch(
        individualRestrictionModified(dailyRestriction, customRestriction)
      );
    } else {
      dispatch(addIndividualRestriction(dailyRestriction, customRestriction));
    }

    handleClose();
  },
});

const mapStateToProps = state => ({
  dailyRestrictionModified: state.restrictions.dailyRestrictionModified,
  defaultRestrictionModified: state.restrictions.defaultRestrictionModified,
  dailyRestriction: state.restrictions.dailyRestriction,
  defaultRestriction: state.restrictions.defaultRestriction,
  individualRestriction: state.restrictions.individualRestriction,
  isDailyRestriction: state.restrictions.isDailyRestriction,
  isCustomRestriction: state.restrictions.isCustomRestriction,
});

const FormikEnhancedForm = formikEnhancer(AddIndividualRestriction);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

export default ConnectedForm;
