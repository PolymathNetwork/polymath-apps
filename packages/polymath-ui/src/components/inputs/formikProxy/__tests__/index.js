import React, { Component } from 'react';
import { render, fireEvent } from '../../../../../testUtils';
import formikProxy from '../index';

class TestInput extends Component {
  handleChange = ({ target }) => {
    this.props.onChange(target.value);
  };
  handleBlur = () => {
    this.props.onBlur();
  };

  render() {
    const { name, value } = this.props;
    return (
      <input
        data-testid="test-input"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        value={value}
        name={name}
      />
    );
  }
}

describe('formikProxy', () => {
  test('sets the right display name', () => {
    const EnhancedInput = formikProxy(TestInput);
    expect(EnhancedInput.displayName).toEqual('formikProxy(TestInput)');
  });

  test("adapts formik props to the input primitive's API", () => {
    const EnhancedInput = formikProxy(TestInput);

    const field = {
      name: 'someField',
      value: '1234',
    };
    const form = {
      setFieldValue: jest.fn(),
    };

    const { getByTestId } = render(<EnhancedInput field={field} form={form} />);
    const input = getByTestId('test-input');
    expect(input.value).toEqual(field.value);
    expect(input.name).toEqual(field.name);
    fireEvent.change(input, { target: { value: 'someValue' } });
    expect(form.setFieldValue).toHaveBeenCalledWith(field.name, 'someValue');
  });
});
