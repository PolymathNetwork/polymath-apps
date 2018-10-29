// @flow

import { range } from 'lodash';
import React, { Component } from 'react';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import moment from 'moment';
import Box from '../../../../components/Box';
import Icon from '../../../../components/Icon';
import theme from '../../../../theme';
import CaretDownIcon from '../../../../images/icons/CaretDown';
import Field from '../../../../components/Field';
import InputLabel from '../../../../components/InputLabel';
import type { InputProps } from '../types';

type OwnProps = {
  format: string,
};
type Props = InputProps & OwnProps;

const styles = {
  container: styles => ({
    ...styles,
    borderRadius: 0,
  }),
  control: (styles, state) => {
    return {
      ...styles,
      backgroundColor: theme.colors.blue[0],
      borderRadius: 0,
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'transparent',
      },
    };
  },
  valueContainer: styles => ({
    ...styles,
    flexGrow: 9,
  }),
  indicatorsContainer: styles => ({
    ...styles,
    flexGrow: 1,
  }),
  dropdownIndicator: styles => ({
    ...styles,
    color: theme.colors.baseText,
    fontSize: theme.fontSizes[1],
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: theme.space[2],
  }),
};

const Container = styled(Box)`
  min-height: 80px;
`;

const SelectContainer = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 7rem;
  margin-right: ${({ theme }) => theme.space[4]}px;
  margin-bottom: ${({ theme }) => theme.space[1]}px;
`;

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
      <Field>
        <InputLabel>{label}</InputLabel>
        <Container>
          <SelectContainer>
            <Select
              id={name}
              styles={styles}
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
          </SelectContainer>
        </Container>
      </Field>
    );
  }
}

export default TimePickerSelectField;
