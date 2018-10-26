// @flow

import React from 'react';
import styled from 'styled-components';
import Select, { components } from 'react-select';

import { currencyOptions } from './data';

import Box from '../Box';
import Icon from '../Icon';
import theme from '../../theme';
import CaretDownIcon from '../../images/icons/CaretDown';
import CloseIcon from '../../images/icons/Close';

import Value from './Value';

type Option = {
  value: string,
  label: Node,
};

type Props = {|
  value: [string],
  options: [Option],
  onChange: Function,
  name: string,
  form: {
    setFieldTouched: (name: string, value: boolean) => void,
  },
|};

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
};

const Container = styled(Box)`
  min-height: 80px;
`;

const SelectContainer = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
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

class CurrencySelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  static defaultProps = {
    options: currencyOptions,
  };

  handleRemove = (removedValue: string) => {
    const {
      value,
      onChange,
      name,
      form: { setFieldTouched },
    } = this.props;
    const newValue = Array.isArray(value)
      ? value.filter(_value => _value !== removedValue)
      : null;

    onChange(newValue, 'remove-value'); // 2nd param is from React-Select "actions" https://react-select.com/props
    setFieldTouched(name, true);
  };

  handleChange(options: [Option], action: string) {
    const { onChange } = this.props;

    return onChange(options.map(option => option.value), action);
  }

  handleBlur() {
    const {
      name,
      form: { setFieldTouched },
    } = this.props;
    setFieldTouched(name, true);
  }

  render() {
    const { value, options, onChange, ...props } = this.props;
    return (
      <Container>
        <SelectContainer>
          <Select
            closeMenuOnSelect={false}
            isClearable={Array.isArray(value) ? value.length : value}
            isMulti={Array.isArray(value)}
            styles={styles}
            components={{
              DropdownIndicator,
              ClearIndicator,
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
            onChange={this.handleChange}
            onMenuClose={this.handleBlur}
            {...props}
          />
        </SelectContainer>
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
      </Container>
    );
  }
}

export default CurrencySelect;
