// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components';
import Select, { components } from 'react-select';
import { intersectionWith } from 'lodash';

import Box from '../../../Box';
import Icon from '../../../Icon';
import CaretDownIcon from '../../../../images/icons/CaretDown';
import CloseIcon from '../../../../images/icons/Close';

import { currencyOptions } from '../data';
import Value from '../Value';

type Option = {
  value: string,
  label: Node,
};

type Props = {|
  value: [string],
  onChange: Function,
  name: string,
  theme: any,
  options?: [Option],
  onBlur?: Function,
|};

const getStyles = theme => ({
  container: styles => ({
    ...styles,
    borderRadius: 0,
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
  valueContainer: () => ({
    position: 'absolute',
    visibility: 'hidden',
    zIndex: -1,
    pointerEvents: 'none',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.space[3],
  }),
  clearIndicator: styles => ({
    ...styles,
    color: 'white',
    backgroundColor: theme.colors.primary,
    borderRadius: '10px',
    fontSize: theme.fontSizes[0],
    alignItems: 'center',
    padding: '3px 5px 3px 7px',
    marginLeft: theme.space[3],
    justifyContent: 'space-between',
    minWidth: '32px',
  }),
});

const SelectContainer = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
  margin-right: ${({ theme }) => theme.space[4]};
`;

const Caret = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
`;

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {props.selectProps.placeholder}
        <Caret Icon={CaretDownIcon} width="10" height="10" />
      </components.DropdownIndicator>
    )
  );
};

const ClearIndicator = props => {
  return (
    components.ClearIndicator && (
      <components.ClearIndicator {...props}>
        {props.selectProps.value.length}
        <Icon Icon={CloseIcon} width="8" height="10" />
      </components.ClearIndicator>
    )
  );
};

class Input extends React.Component<Props> {
  static defaultProps = {
    options: currencyOptions.map(option => option.value),
  };

  componentDidMount = () => {
    currencyOptions.forEach(currency => {
      const img = new Image();
      img.src = currency.label.props.icon;
    });
  };

  handleRemove = (removedValue: string) => {
    const { value, onChange } = this.props;
    const newValue = Array.isArray(value)
      ? value.filter(_value => _value !== removedValue)
      : null;

    onChange(newValue, 'remove-value'); // 2nd param is from React-Select "actions" https://react-select.com/props
  };

  handleChange = (value: [Option], action: string) => {
    const { onChange } = this.props;

    return onChange(
      Array.isArray(value) ? value.map(option => option.value) : value.value,
      action
    );
  };

  render() {
    const { value, options, onChange, onBlur, theme, ...props } = this.props;

    const filteredOptions = intersectionWith(
      currencyOptions,
      options,
      (currency, symbol) => {
        return currency.value === symbol;
      }
    );

    const valueIsArray = Array.isArray(value);
    const arrayValue = valueIsArray ? value : [value];

    const selectedValue = arrayValue.map(
      _value => filteredOptions.find(option => option.value === _value) || {}
    );

    return (
      <div>
        <SelectContainer>
          <Select
            closeMenuOnSelect={false}
            noOptionsMessage={() => null}
            isClearable={valueIsArray ? value.length : value}
            isMulti={valueIsArray}
            styles={getStyles(theme)}
            components={{
              DropdownIndicator,
              ClearIndicator,
              IndicatorSeparator: null,
            }}
            options={filteredOptions}
            value={selectedValue}
            onChange={this.handleChange}
            onMenuClose={onBlur}
            {...props}
          />
        </SelectContainer>
        {arrayValue.map(value => {
          const option = filteredOptions.find(option => option.value === value);
          return option ? (
            <Value
              value={option.value}
              key={value}
              label={option.label}
              onRemove={this.handleRemove}
            />
          ) : null;
        })}
      </div>
    );
  }
}

export default withTheme(Input);
