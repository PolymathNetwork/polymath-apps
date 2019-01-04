import React, { Component } from 'react';
import ReactSelect, { components } from 'react-select';

import styled, { withTheme, ThemeInterface } from '~/styles';
import { Icon } from '../../Icon';
import { SvgCaretDown } from '../../../images/icons/CaretDown.svg';
import { formikProxy } from '../formikProxy';
import { InputProps } from '../types';

export interface SelectProps extends InputProps {
  theme: ThemeInterface;
}

const getStyles = (theme: ThemeInterface) => ({
  container: (styles: any) => ({
    ...styles,
    borderRadius: 0,
    minHeight: theme.inputs.height,
    minWidth: '7rem',
  }),
  control: (styles: any) => {
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
  valueContainer: (styles: any) => ({
    ...styles,
    fontSize: theme.fontSizes.baseText,
  }),
});

const Caret = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
`;

const DropdownIndicator = (props: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Caret Asset={SvgCaretDown} width="10" height="10" />
      </components.DropdownIndicator>
    )
  );
};

class _SelectPrimitive extends Component<SelectProps> {
  render() {
    const { theme, name, value, ...props } = this.props;

    return (
      <ReactSelect
        inputId={name}
        styles={getStyles(theme)}
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          ClearIndicator: null,
        }}
        backspaceRemovesValue={false}
        isSearchable={false}
        {...props}
      />
    );
  }
}

export const SelectPrimitive = withTheme(_SelectPrimitive);
export const Select = formikProxy(SelectPrimitive);
