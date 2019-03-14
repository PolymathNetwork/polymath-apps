import React, { Component, FC } from 'react';
import ReactSelect, { components } from 'react-select';
import { Props as ReactSelectProps } from 'react-select/lib/Select';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { withTheme, ThemeInterface } from '~/styles';
import { Selects } from '~/styles/types';
import { Icon } from '~/components/Icon';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { FormikProxy, EnhancedComponentProps } from '../FormikProxy';

interface Props<OptT extends any = any>
  extends typeHelpers.Omit<
    ReactSelectProps<OptT>,
    'theme' | 'onChange' | 'onBlur'
  > {
  theme: ThemeInterface;
  onChange: (value: OptT['value']) => void;
  onBlur: () => void;
  variant: keyof Selects;
  name?: string;
}

const getStyles = (theme: ThemeInterface, variant: keyof Selects) =>
  ({
    primary: {
      container: (styles: any) => ({
        ...styles,
        borderRadius: 0,
        minHeight: theme.inputs.height,
        minWidth: '7rem',
      }),
      control: (styles: any, state: any) => {
        return {
          ...styles,
          backgroundColor: theme.inputs.backgroundColor,
          borderRadius: 0,
          borderColor: 'transparent',
          boxShadow: 'none',
          borderBottom:
            state.isFocused && `1px solid ${theme.colors.secondary}`,
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
      dropdownIndicator: (styles: any) => ({
        ...styles,
        color: theme.colors.secondary,
      }),
    },
    ghost: {
      container: (styles: any) => ({
        ...styles,
        borderRadius: 0,
        minHeight: theme.inputs.height,
        minWidth: '4rem',
      }),
      control: (styles: any) => {
        return {
          ...styles,
          borderRadius: 0,
          borderColor: 'transparent',
          '&:hover': {
            borderColor: 'transparent',
          },
          boxShadow: 'none',
          minHeight: theme.inputs.height,
        };
      },
      valueContainer: (styles: any) => ({
        ...styles,
        fontSize: theme.fontSizes.baseText,
      }),
      dropdownIndicator: (styles: any) => ({
        ...styles,
        color: theme.colors.blue[1],
      }),
      singleValue: (styles: any) => ({
        ...styles,
        color: theme.colors.blue[1],
        fontWeight: theme.fontWeights.bold,
      }),
    },
  }[variant]);

const DropdownIndicator = ({ variant, ...props }: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Icon Asset={SvgCaretDown} width={10} height={10} />
      </components.DropdownIndicator>
    )
  );
};

class SelectPrimitiveBase extends Component<Props> {
  public static defaultProps = {
    isClearable: false,
    variant: 'primary',
  };

  public handleChange = ({ value }: { label: string; value: number }) => {
    this.props.onChange(value);
  };

  public render() {
    const {
      theme,
      variant,
      name,
      onChange,
      value,
      options,
      ...props
    } = this.props;

    return (
      <ReactSelect
        inputId={name}
        styles={getStyles(theme, variant)}
        components={{
          DropdownIndicator,
          IndicatorSeparator: null,
          ClearIndicator: null,
        }}
        backspaceRemovesValue={false}
        isSearchable={false}
        onChange={this.handleChange}
        menuPlacement="auto"
        value={
          typeof value === 'object' || !options
            ? value
            : options.find(option => option.value === value)
        }
        options={options}
        {...props}
      />
    );
  }
}

const ThemedSelectPrimitive = withTheme(SelectPrimitiveBase);
export const SelectPrimitive = Object.assign(ThemedSelectPrimitive, {
  defaultProps: SelectPrimitiveBase.defaultProps,
});

const EnhancedSelect: FC<EnhancedComponentProps<any>> = ({ field, form, onChange, ...rest }) => (
  <FormikProxy<any>
    field={field}
    form={form}
    onChange={onChange}
    render={formikProps => <SelectPrimitive {...rest} {...formikProps} />}
  />
);

export const Select = Object.assign(EnhancedSelect, {
  defaultProps: SelectPrimitive.defaultProps,
});

export type SelectProps = typeHelpers.GetProps<typeof Select>;
