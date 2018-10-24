// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';

import { currencyOptions } from './data';

import Box from '../Box';
import theme from '../../theme';
import CaretDownIcon from '../../images/icons/CaretDown';

import Value from './Value';

type Option = {
  value: string,
  label: Node,
};

type Props = {|
  value: [string],
  options: [Option],
  onChange: Function,
|};

const colourStyles = {
  container: styles => ({
    ...styles,
    borderRadius: 0,
  }),
  control: (styles, state) => {
    return {
      ...styles,
      backgroundColor: theme.colors.gray[0],
      borderRadius: 0,
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'transparent',
      },
    };
  },
  dropdownIndicator: (styles, { data }) => ({
    ...styles,
    color: theme.colors.baseTextColor,
  }),
};

const Container = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
`;

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        {props.selectProps.placeholder}
        <CaretDownIcon />
      </components.DropdownIndicator>
    )
  );
};

class CurrencySelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
  }

  static defaultProps = {
    options: currencyOptions,
  };

  handleRemove(removedValue: string) {
    const { value, onChange } = this.props;
    const newValue = Array.isArray(value)
      ? value.filter(_value => _value !== removedValue)
      : null;

    onChange(newValue, 'remove-value'); // 2nd param is from React-Select "actions" https://react-select.com/props
  }

  render() {
    const { value, options, ...props } = this.props;
    return (
      <Fragment>
        <Container mr={4}>
          <Select
            closeMenuOnSelect={false}
            isMulti={Array.isArray(value)}
            styles={colourStyles}
            components={{
              DropdownIndicator,
              IndicatorSeparator: null,
              ValueContainer: () => null,
            }}
            options={options}
            value={
              Array.isArray(value)
                ? value.map(
                    _value =>
                      options.find(option => option.value === _value) || {}
                  )
                : value
            }
            {...props}
          />
        </Container>
        {Array.isArray(value) &&
          value.map(value => {
            const option = options.find(option => option.value === value);

            return option ? (
              <Value
                value={option.value}
                key={value}
                label={option.label}
                onRemove={this.handleRemove}
              />
            ) : null;
          })}
      </Fragment>
    );
  }
}

export default CurrencySelect;
