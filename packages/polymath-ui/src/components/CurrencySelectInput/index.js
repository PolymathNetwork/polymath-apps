// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

import { currencyOptions } from './data';

import Box from '../Box';
import theme from '../../theme';

import SelectValue from './SelectValue';

type Props = {|
  values: [
    {
      value: string,
      label: Node,
    },
  ],
|};

const colourStyles = {
  container: styles => ({
    ...styles,
    borderRadius: 0,
  }),
  control: (styles, state) => {
    console.log(styles);
    console.log(state);
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
      // backgroundColor: isDisabled
      //   ? null
      //   : isSelected
      //     ? data.color
      //     : isFocused
      //       ? color.alpha(0.1).css()
      //       : null,
      // color: isDisabled
      //   ? '#ccc'
      //   : isSelected
      //     ? chroma.contrast(color, 'white') > 2
      //       ? 'white'
      //       : 'black'
      //     : data.color,
      // cursor: isDisabled ? 'not-allowed' : 'default',
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

const CurrencySelectInput = ({ values, ...props }: Props) => (
  <InlineBlock minWidth="200px">
    <Select
      closeMenuOnSelect={false}
      isMulti
      styles={colourStyles}
      components={{ IndicatorSeparator: null }}
      value={values}
      {...props}
    />
    {values &&
      values.map(value => (
        <SelectValue key={value.value} label={value.label} />
      ))}
  </InlineBlock>
);

export default CurrencySelectInput;

CurrencySelectInput.defaultProps = {
  options: currencyOptions,
};
