// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

import { currencyOptions } from './data';

import Box from '../Box';
import theme from '../../theme';

import Value from './Value';

type Props = {|
  values: [
    {
      value: string,
      label: Node,
    },
  ],
  options: [],
  onRemoveValue: Function,
|};

const colourStyles = {
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
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
    };
  },
  // multiValue: (styles, { data }) => {
  //   const color = chroma(data.color);
  //   return {
  //     ...styles,
  //     backgroundColor: color.alpha(0.1).css(),
  //   };
  // },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

const Container = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
`;

const CurrencySelect = ({ values, onRemoveValue, ...props }: Props) => {
  return (
    <Fragment>
      <Container mr={5}>
        <Select
          closeMenuOnSelect={false}
          isMulti
          styles={colourStyles}
          components={{
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
            onRemove={onRemoveValue}
          />
        ))}
    </Fragment>
  );
};

export default CurrencySelect;

CurrencySelect.defaultProps = {
  options: currencyOptions,
};
