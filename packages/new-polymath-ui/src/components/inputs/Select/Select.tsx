import React, { Component } from 'react';
import ReactSelect, { components } from 'react-select';
import { Props as ReactSelectProps } from 'react-select/lib/Select';
import { typeHelpers } from '@polymathnetwork/new-shared';
import styled, { withTheme, ThemeInterface } from '~/styles';
import { Icon } from '~/components/Icon';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { formikProxy } from '../formikProxy';

export interface SelectProps<OptT extends any = any>
  extends typeHelpers.Omit<
    ReactSelectProps<OptT>,
    'theme' | 'onChange' | 'onBlur'
  > {
  name: string;
  theme: ThemeInterface;
  onChange: (value: OptT['value']) => void;
  onBlur: () => void;
}

export interface CaretProps {
  width: number;
  height: number;
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

const Caret = styled(Icon)<CaretProps>`
  color: ${({ theme }) => theme.colors.secondary};
`;

const DropdownIndicator = (props: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Caret Asset={SvgCaretDown} width={10} height={10} />
      </components.DropdownIndicator>
    )
  );
};

class SelectPrimitiveBase extends Component<SelectProps> {
  public static defaultProps = {
    isClearable: false,
  };

  public handleChange = ({ value }: { label: string; value: number }) => {
    this.props.onChange(value);
  };

  public render() {
    const { theme, name, value, isClearable, ...props } = this.props;

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
        isClearable={isClearable}
        onChange={this.handleChange}
        {...props}
      />
    );
  }
}

export const SelectPrimitive = withTheme(SelectPrimitiveBase);
const EnahncedSelect = formikProxy(SelectPrimitive);

export const Select = Object.assign(EnahncedSelect, {
  defaultProps: SelectPrimitive.defaultProps,
});
