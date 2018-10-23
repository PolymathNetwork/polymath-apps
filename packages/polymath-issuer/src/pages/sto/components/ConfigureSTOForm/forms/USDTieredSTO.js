// @flow
import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { Form, Tooltip, Button } from 'carbon-components-react';
import {
  Box,
  Grid,
  Heading,
  RaisedAmount,
  Remark,
  thousandsDelimiter,
} from '@polymathnetwork/ui';

import { DatePickerInput, TimePickerSelect } from '@polymathnetwork/ui/next';

// === Temp validators= === //
const required = () => {};
const todayOrLater = () => {};
const afterStart = () => {};
const secondsAfterNow = () => {};

export const USDTieredSTOFormComponent = ({ submit }) => (
  <Form onSubmit={submit}>
    <Heading variant="h3">STO Schedule</Heading>
    <Box mb={4}>
      <div className="time-pickers-container">
        <Field
          name="startDate"
          component={DatePickerInput}
          label="Start Date"
          placeholder="mm / dd / yyyy"
          validate={[required, todayOrLater]}
        />
        <Field
          name="startTime"
          step={30}
          component={TimePickerSelect}
          className="bx--time-picker__select"
          placeholder="hh:mm"
          label="Time"
          validate={[required, secondsAfterNow]}
        />

        <Field
          name="endDate"
          component={DatePickerInput}
          label="End Date"
          placeholder="mm / dd / yyyy"
          validate={[required, todayOrLater, afterStart]}
        />
        <Field
          name="endTime"
          step={30}
          component={TimePickerSelect}
          className="bx--time-picker__select"
          placeholder="hh:mm"
          label="Time"
          validate={[required, afterStart]}
        />
      </div>
    </Box>
  </Form>
);

export default class USDTieredSTOForm extends Component {
  render() {
    return <USDTieredSTOFormComponent />;
  }
}
