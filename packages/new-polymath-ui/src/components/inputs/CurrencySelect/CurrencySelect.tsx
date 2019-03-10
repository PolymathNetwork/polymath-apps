import React, { FC, Fragment, ReactNode } from 'react';
import Select, { components } from 'react-select';
import { IndicatorProps } from 'react-select/lib/components/indicators';
import { Styles } from 'react-select/lib/styles';
import { intersectionWith, filter, includes } from 'lodash';
import { types } from '@polymathnetwork/new-shared';
import {
  FormikProxy,
  FormikExternalProps,
} from '~/components/inputs/FormikProxy';
import { SvgCaretDown } from '~/images/icons/CaretDown';
import { SvgClose } from '~/images/icons/Close';
import { SvgEth } from '~/images/icons/Eth';
import { SvgPoly } from '~/images/icons/Poly';
import { SvgDai } from '~/images/icons/Dai';
import { SvgErc20 } from '~/images/icons/Erc20';
import { withTheme, ThemeInterface, styled } from '~/styles';
import { Box } from '~/components/Box';
import { Icon } from '~/components/Icon';
import { InputProps } from '~/components/inputs/types';
import { Label } from './Label';
import * as sc from './styles';

interface OptionType {
  value: types.Tokens;
  label: ReactNode;
}

interface ExternalProps extends FormikExternalProps {
  theme: ThemeInterface;
  placeholder?: string;
}

type Value = types.Tokens | types.Tokens[];

export const CURRENCY_OPTIONS: OptionType[] = [
  {
    value: types.Tokens.Ether,
    label: (
      <Label text="Ethereum (ETH)" Asset={SvgEth} token={types.Tokens.Ether} />
    ),
  },
  {
    value: types.Tokens.Poly,
    label: (
      <Label text="Polymath (POLY)" Asset={SvgPoly} token={types.Tokens.Poly} />
    ),
  },
  {
    value: types.Tokens.Dai,
    label: <Label text="Dai (DAI)" Asset={SvgDai} token={types.Tokens.Dai} />,
  },
  {
    value: types.Tokens.Erc20,
    label: (
      <Label text="ERC20 Token" Asset={SvgErc20} token={types.Tokens.Erc20} />
    ),
  },
];

interface SelectProps
  extends Pick<InputProps, 'onChange' | 'error' | 'name' | 'autoComplete'> {
  options: types.Tokens[];
  theme: ThemeInterface;
  value: types.Tokens | types.Tokens[];
  // Override because ReactSelect does not provide the event
  onBlur: () => void;
  placeholder?: string;
}

const getStyles = (theme: ThemeInterface): Styles => ({
  container: styles => ({
    ...styles,
    borderRadius: 0,
  }),
  control: styles => {
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

const SelectWrapper = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
  margin-right: ${({ theme }) => theme.space[4]};
`;

const Caret = styled(Icon)`
  color: ${({ theme }) => theme.colors.secondary};
`;

interface CustomIndicatorProps extends IndicatorProps<OptionType> {
  selectProps: SelectProps;
}

const DropdownIndicator: FC<CustomIndicatorProps> = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <Fragment>
          {props.selectProps.placeholder}
          <Caret Asset={SvgCaretDown} width={10} height={10} />
        </Fragment>
      </components.DropdownIndicator>
    )
  );
};

const ClearIndicator: FC<CustomIndicatorProps> = props => {
  return (
    components.ClearIndicator && (
      <components.ClearIndicator {...props}>
        <Fragment>
          {props.selectProps.value.length}
          <Icon Asset={SvgClose} width={8} height={10} />
        </Fragment>
      </components.ClearIndicator>
    )
  );
};

interface SelectValueProps {
  label: ReactNode;
  value: types.Tokens;
  onRemove: (value: types.Tokens) => void;
}

class SelectValue extends React.Component<SelectValueProps> {
  public handleRemove = () => {
    this.props.onRemove(this.props.value);
  };

  public render() {
    return (
      <sc.ValueWrapper>
        <sc.ValueLabel>{this.props.label}</sc.ValueLabel>
        <sc.ValueRemoveButton
          Asset={SvgClose}          
          onClick={this.handleRemove}
        />
      </sc.ValueWrapper>
    );
  }
}

export class CurrencySelectPrimitiveBase extends React.Component<SelectProps> {
  public static defaultProps = {
    options: CURRENCY_OPTIONS.map(option => option.value),
    onBlur: () => {},
    onChange: () => {},
  };

  public handleRemove = (removedValue: string) => {
    const { value, onChange, onBlur } = this.props;
    const newValue = Array.isArray(value)
      ? value.filter(val => val !== removedValue)
      : null;

    onChange(newValue);
    onBlur();
  };

  public handleChange = (value?: OptionType | OptionType[] | null) => {
    const { onChange, onBlur } = this.props;

    if (!value) {
      return;
    }

    const result = Array.isArray(value)
      ? value.map(option => option.value)
      : value.value;

    onChange(result);
    onBlur();
  };

  public handleBlur = () => {
    const { onBlur } = this.props;
    onBlur();
  };

  public render() {
    const { value, options, onChange, onBlur, theme, ...rest } = this.props;

    const filteredOptions = intersectionWith(
      CURRENCY_OPTIONS,
      options,
      (currency, symbol) => {
        return currency.value === symbol;
      }
    );

    const valueIsArray = Array.isArray(value);
    let arrayValue: types.Tokens[];

    if (!Array.isArray(value)) {
      arrayValue = [value];
    } else {
      arrayValue = value;
    }

    const selectedValues = filter(filteredOptions, ({ value: currencyType }) =>
      includes(arrayValue, currencyType)
    );

    return (
      <div>
        <SelectWrapper>
          <Select
            closeMenuOnSelect={false}
            noOptionsMessage={() => null}
            isClearable={valueIsArray}
            isMulti={valueIsArray}
            styles={getStyles(theme)}
            components={{
              DropdownIndicator,
              ClearIndicator,
              IndicatorSeparator: null,
            }}
            options={filteredOptions}
            value={selectedValues}
            onChange={this.handleChange}
            onMenuClose={onBlur}
            {...rest}
          />
        </SelectWrapper>
        {arrayValue.map(val => {
          const option = filteredOptions.find(
            ({ value: currencyType }) => currencyType === val
          );
          return option ? (
            <SelectValue
              value={option.value}
              key={val}
              label={option.label}
              onRemove={this.handleRemove}
            />
          ) : null;
        })}
      </div>
    );
  }
}

const EnhancedCurrencySelectPrimitive: FC<ExternalProps> = ({
  field,
  form,
  ...rest
}) => (
  <FormikProxy<Value>
    field={field}
    form={form}
    render={formikProps => (
      <CurrencySelectPrimitiveBase {...rest} {...formikProps} />
    )}
  />
);

export const CurrencySelect = withTheme(EnhancedCurrencySelectPrimitive);
