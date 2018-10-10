import React, { Fragment } from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import {
  CheckboxInput,
  DatePickerInput,
  DatePickerRangeInput,
  RadioInput,
  selectInput,
  TextAreaInput,
  TextInput,
  TimePickerInput,
} from './';

test('renders without crashing', () => {
  // TODO @grsmto: investigate why the DatePickers are not rendering here
  const component = renderer.create(
    <Fragment>
      <CheckboxInput input={{ name: '1' }} label="1" meta={{}} />
      {/* <DatePickerInput input={{ name: '2' }} meta={{}} label="Sale Lockup End Date" />
      <DatePickerRangeInput input={{ name: 'start-end' }} label="Start Date;End Date" meta={{}} /> */}
      <RadioInput
        input={{ name: '4' }}
        meta={{}}
        options={[
          { label: 'Divisible', value: '0' },
          { label: 'Indivisible', value: '1' },
        ]}
      />
      <selectInput input={{ name: '5' }} meta={{}} />
      <TextAreaInput input={{ name: '6' }} label="6" meta={{}} />
      <TextInput input={{ name: '7' }} label="7" meta={{}} />
      <TimePickerInput
        input={{
          name: '8',
          value: {
            timeString: '',
            dayPeriod: 'AM',
          },
        }}
        meta={{}}
      />
    </Fragment>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
