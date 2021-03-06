// @flow

import { range } from 'lodash';
import React, { Component } from 'react';
import Select, { components } from 'react-select';
import styled, { withTheme } from 'styled-components';
import moment from 'moment';

import Icon from '../../Icon';
import CaretDownIcon from '../../../images/icons/CaretDown';
import type { InputProps } from '../types';

type OwnProps = {
  format: string,
  theme: any,
};
type Props = InputProps & OwnProps;

const getStyles = theme => ({
  container: styles => ({
    ...styles,
    borderRadius: 0,
    minHeight: theme.inputs.height,
    minWidth: '7rem',
  }),
  control: (styles, state) => {
    return {
      ...styles,
      backgroundColor: theme.inputs.backgroundColor,
      borderRadius: 0,
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'transparent',
      },
      minHeight: theme.inputs.height,
    };
  },
  valueContainer: styles => ({
    ...styles,
    fontSize: theme.fontSizes.baseText,
  }),
});

const Caret = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
`;

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Caret Icon={CaretDownIcon} width="10" height="10" />
      </components.DropdownIndicator>
    )
  );
};

const minutesInADay = 60 * 24;
const timeIntervals = range(0, minutesInADay, 30);

class TimePickerSelectField extends Component<Props> {
  static defaultProps = {
    format: 'h:mm A',
  };

  handleChange = ({ value, label }: { value: number, label: string }) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;
    setFieldValue(name, value);
  };

  handleMenuClose = () => {
    const {
      form: { setFieldTouched },
      field: { name },
    } = this.props;

    setFieldTouched(name, true);
  };

  render() {
    const {
      field: { name, value },
      className,
      format,
      label,
      placeholder,
      theme,
      ...props
    } = this.props;

    const timeOptions = timeIntervals.map(minutes => {
      const time = moment(0)
        .utcOffset(0)
        .add(minutes, 'minutes');

      const inMs = minutes * 60 * 1000;
      return { label: time.format(format), value: inMs };
    });
    const selectedOption = timeOptions.find(option => option.value === value);

    return (
      <Select
        inputId={name}
        styles={getStyles(theme)}
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          ClearIndicator: null,
        }}
        backspaceRemovesValue={false}
        isSearchable={false}
        options={timeOptions}
        onChange={this.handleChange}
        onMenuClose={this.handleMenuClose}
        value={selectedOption}
        placeholder={placeholder}
        {...props}
      />
    );
  }
}

export default withTheme(TimePickerSelectField);
