// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';

import { currencyOptions } from './data';

import Box from '../Box';
import theme from '../../theme';
import CaretDownIcon from '../../images/icons/CaretDown';

import Value from './Value';

type ValueType = {
  value: string,
  label: Node,
};

type Props = {|
  values: [ValueType],
  options: [ValueType],
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

  handleRemove(value: ValueType) {
    const { onChange, values } = this.props;
    onChange(values.filter(_value => _value !== value));
  }

  render() {
    const { values, ...props } = this.props;
    return (
      <Fragment>
        <Container mr={4}>
          <Select
            closeMenuOnSelect={false}
            isMulti
            styles={colourStyles}
            components={{
              DropdownIndicator,
              IndicatorSeparator: null,
              ValueContainer: () => null,
            }}
            value={values}
            {...props}
          />
        </Container>
        {values &&
          values.map(value => (
            <Value
              value={value}
              key={value.value}
              label={value.label}
              onRemove={this.handleRemove}
            />
          ))}
      </Fragment>
    );
  }
}

export default CurrencySelect;
