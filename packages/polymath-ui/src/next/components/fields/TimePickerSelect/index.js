// @flow

import { range } from 'lodash';
import React, { Component } from 'react';
import { Select, SelectItem } from 'carbon-components-react';
import moment from 'moment';

import type { InputProps } from '../types';

type OwnProps = {
  format: string,
};
type Props = InputProps & OwnProps;

const minutesInADay = 60 * 24;
const timeIntervals = range(0, minutesInADay, 30);

class TimePickerSelectField extends Component<Props> {
  static defaultProps = {
    format: 'h:mm A',
  };

  handleOnChange = ({ target: { value } }: SyntheticInputEvent<>) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;
    const numericValue = parseInt(value, 10);
    setFieldValue(name, numericValue);
  };

  render() {
    const {
      field,
      className,
      format,
      label,
      placeholder,
      ...props
    } = this.props;

    const timeOptions = timeIntervals.map(minutes => {
      const time = moment(0)
        .utcOffset(0)
        .add(minutes, 'minutes');

      const inMs = minutes * 60 * 1000;
      return { label: time.format(format), value: inMs };
    });

    return (
      <Select
        id={field.name}
        hideLabel={false}
        className={className}
        defaultValue=""
        labelText={label}
        {...props}
        {...field}
        onChange={this.handleOnChange}
      >
        <SelectItem disabled hidden value="" text={placeholder} />
        {timeOptions.map(({ value, label }) => {
          return <SelectItem key={value} value={value} text={label} />;
        })}
      </Select>
    );
  }
}

export default TimePickerSelectField;
