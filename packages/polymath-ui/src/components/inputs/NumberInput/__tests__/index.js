import React from 'react';
import { render, fireEvent } from '../../../../../testUtils';
import { NumberInput } from '../index';

let defaultProps;

/**
 * Props for primitive:
 * - name
 * - value
 * - onChange
 * - onBlur
 *
 * Props for interface to Formik
 * - field { name, value }
 * - form { setFieldValue, errors, touched }
 */

// TODO @RafaelVidaurre: Support decimals config, length limit, negative values
describe('NumberInput', () => {
  test('renders without crashing ', () => {
    const { container } = render(<NumberInput name="foo" value={12344.555} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('updates display value when field value changes', () => {
    const { container, rerender } = render(<NumberInput />);

    rerender(<NumberInput name="foo" value={123.456} />);
    expect(container.querySelector('input').value).toEqual('123.456');
  });

  test('calls onChange with new numeric value when display value changes to a final state', () => {
    // A final state is any state where a number value can be parsed Examples:
    // "0.1", "123" are final
    // "0.0", "12." are not final
    const onChange = jest.fn();
    const { container } = render(
      <NumberInput value={1} name="foo" onChange={onChange} />
    );
    const input = container.getByTestId('base-input');
    fireEvent.change(input, { target: { value: '12' } });
    expect(onChange).toHaveBeenCalledWith(12);
  });

  test('does not call onChange on render', () => {
    const onChange = jest.fn();
    render(<NumberInput value={1} name="foo" onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not update field value if the input is in an intermediate state', () => {
    // Valid states where we cannot yet get a new value update
    // Examples:
    // "." could become ".1"
    // "0.12000" could become "0.120003"
    const onChange = jest.fn();
    const { container } = render(
      <NumberInput value={1} name="foo" onChange={onChange} />
    );
    const input = container.getByTestId('base-input');
    fireEvent.change(input, { target: { value: '1.' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('prepends a "0" if the display value starts with a "." ', () => {
    const { container } = render(<NumberInput value={1} name="foo" />);
    const input = container.getByTestId('base-input');
    fireEvent.change(input, { target: { value: '.' } });
    expect(input.value).toEqual('0.');
    fireEvent.change(input, { target: { value: '.123' } });
    expect(input.value).toEqual('0.123');
  });

  test('removes prepended "0" from display value unless it is in first digits position', () => {
    // Examples: "01", "04.1234"
    const { container } = render(<NumberInput value={0} name="foo" />);
    const input = container.getByTestId('base-input');
    fireEvent.change(input, { target: { value: '00' } });
    expect(input.value).toEqual('0');
    fireEvent.change(input, { target: { value: '00.123' } });
    expect(input.value).toEqual('0.123');
    fireEvent.change(input, { target: { value: '001444' } });
    expect(input.value).toEqual('1444');
  });

  test('does not allow changes that reach a non-intermediate invalid state', () => {
    // Examples of these states are "0.." "00"
    const { container } = render(<NumberInput value={0} name="foo" />);
    const input = container.getByTestId('base-input');
    // Intermediate state
    fireEvent.change(input, { target: { value: '0.' } });
    // Invalid state
    fireEvent.change(input, { target: { value: '0..' } });
    expect(input.value).toEqual('0.');
  });

  test('calls onBlur when the input looses focus', () => {
    const onBlur = jest.fn();
    const { container } = render(
      <NumberInput value={0} name="foo" onBlur={onBlur} />
    );
    const input = container.getByTestId('base-input');
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });
});

describe('NumberInputField', () => {
  test('pending', () => {});
});
