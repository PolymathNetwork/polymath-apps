import { range } from 'lodash';
import React, { Component, FC } from 'react';
import moment from 'moment';

import { SelectPrimitive, SelectProps } from '../Select';
import {
  FormikProxy,
  EnhancedComponentProps,
} from '~/components/inputs/FormikProxy';

export type TimePickerSelectProps = SelectProps & {
  format: string;
  onChange: (value: number) => void;
  onBlur: () => void;
  value: number;
  onMenuClose: () => void;
};

interface ExternalProps extends EnhancedComponentProps<number> {
  format: string;
  onMenuClose: () => void;
}

const minutesInADay = 60 * 24;
const timeIntervals = range(0, minutesInADay, 30);

export class TimePickerSelectPrimitive extends Component<
  TimePickerSelectProps
> {
  public static defaultProps = {
    format: 'h:mm A',
    onBlur: () => {},
  };

  public handleChange = (value: number) => {
    this.props.onChange(value);
  };

  public render() {
    const { format, onChange, value, ...props } = this.props;
    const timeOptions = timeIntervals.map(minutes => {
      const time = moment(0)
        .utcOffset(0)
        .add(minutes, 'minutes');
      const inMs = minutes * 60 * 1000;

      return { label: time.format(format), value: inMs };
    });
    const selectedOption = timeOptions.find(option => option.value === value);

    return (
      <SelectPrimitive
        options={timeOptions}
        onChange={this.handleChange}
        value={selectedOption}
        {...props}
      />
    );
  }
}

class TimePickerSelectBase extends Component<TimePickerSelectProps> {
  // We trigger an onBlur event when menu closes to trigger Formik validation
  public handleMenuClose = () => {
    this.props.onBlur();
  };

  public render() {
    return (
      <TimePickerSelectPrimitive
        onMenuClose={this.handleMenuClose}
        {...this.props}
      />
    );
  }
}

const EnhancedTimePickerSelect: FC<ExternalProps> = ({
  field,
  form,
  onChange,
  ...rest
}) => (
  <FormikProxy<number>
    field={field}
    form={form}
    onChange={onChange}
    render={formikProps => (
      <TimePickerSelectBase
        field={field}
        form={form}
        {...rest}
        {...formikProps}
      />
    )}
  />
);

export const TimePickerSelect = EnhancedTimePickerSelect;
