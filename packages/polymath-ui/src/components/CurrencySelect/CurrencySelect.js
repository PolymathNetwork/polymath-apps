// @flow

import React, { Fragment } from 'react';
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
    padding: '0px 6px 0px 7px',
    marginLeft: theme.space[3],
    justifyContent: 'space-between',
    minWidth: '35px',
  }),
};

const Container = styled(Box)`
  display: inline-block;
  vertical-align: middle;
  min-width: 200px;
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
        <Icon Icon={CloseIcon} width="8" height="9" />
      </components.ClearIndicator>
    )
  );
};

class CurrencySelect extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleRemove = this.handleRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleChange(options: [Option], action: string) {
    const { onChange } = this.props;

    return onChange(options.map(option => option.value), action);
  }

  render() {
    const { value, options, onChange, ...props } = this.props;
    return (
      <Fragment>
        <Container mr={4}>
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
