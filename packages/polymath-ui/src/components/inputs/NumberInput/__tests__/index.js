import React, { Component } from 'react';
import { Formik } from 'formik';
import { render, waitForElement, fireEvent } from '../../../../../testUtils';
import NumberInputField, { NumberInput } from '../index';
import FormItem from '../../../FormItem';

// TODO @RafaelVidaurre: Support decimals config, length limit, negative values
describe('NumberInput', () => {
  test('renders without crashing ', () => {
    const { container } = render(<NumberInput name="foo" value={12344.555} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  test('updates display value when field value changes', () => {
    const { getByTestId, rerender } = render(
      <NumberInput value={2} name="test" />
    );

    rerender(<NumberInput name="foo" value={123.456} />);
    expect(getByTestId('base-input').value).toEqual('123.456');
  });

  test('calls onChange with new numeric value when display value changes to a final state', () => {
    // A final state is any state where a number value can be parsed Examples:
    // "0.1", "123" are final
    // "0.0", "12." are not final
    const onChange = jest.fn();
    const { getByTestId } = render(
      <NumberInput value={1} name="foo" onChange={onChange} />
    );
    const input = getByTestId('base-input');
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
    const { getByTestId } = render(
      <NumberInput value={1} name="foo" onChange={onChange} />
    );
    const input = getByTestId('base-input');
    fireEvent.change(input, { target: { value: '1.' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('prepends a "0" if the display value starts with a "." and has decimals ', async () => {
    const { getByTestId } = render(<NumberInput value={1} name="foo" />);
    const input = getByTestId('base-input');
    fireEvent.change(input, { target: { value: '.1' } });

    expect(getByTestId('base-input').value).toEqual('0.1');

    fireEvent.change(input, { target: { value: '.123' } });

    expect(getByTestId('base-input').value).toEqual('0.123');
  });

  test('removes prepended "0" from display value unless it is in first digits position', () => {
    // Examples: "01", "04.1234"
    const { getByTestId } = render(<NumberInput value={0} name="foo" />);
    const input = getByTestId('base-input');
    fireEvent.change(input, { target: { value: '00' } });
    expect(input.value).toEqual('0');
    fireEvent.change(input, { target: { value: '00.123' } });
    expect(input.value).toEqual('0.123');
    fireEvent.change(input, { target: { value: '001444' } });
    expect(input.value).toEqual('1,444');
  });

  test('does not allow changes that reach a non-intermediate invalid state', () => {
    // Examples of these states are "0.." "00"
    const { getByTestId } = render(<NumberInput value={0} name="foo" />);
    const input = getByTestId('base-input');
    // Intermediate state
    fireEvent.change(input, { target: { value: '0.' } });
    // Invalid state
    fireEvent.change(input, { target: { value: '0..' } });
    expect(input.value).toEqual('0.');
  });

  test('calls onBlur when the input looses focus', () => {
    const onBlur = jest.fn();
    const { getByTestId } = render(
      <NumberInput value={0} name="foo" onBlur={onBlur} />
    );
    const input = getByTestId('base-input');
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalled();
  });
});

class TestForm extends Component {
  state = { submitted: 'notsubmitted' };
  handleSubmit = (...args) => {
    const { onSubmit } = this.props;
    this.setState({ submitted: 'submitted' });
    onSubmit(...args);
  };
  render() {
    return (
      <Formik
        onSubmit={this.handleSubmit}
        render={({ handleSubmit }) => {
          const { submitted } = this.state;
          return (
            <form data-testid="form" onSubmit={handleSubmit}>
              <p>{submitted}</p>
              <FormItem name="foo">
                <FormItem.Input component={NumberInputField} />
              </FormItem>
              <input data-testid="submit" type="submit" value="Submit" />
            </form>
          );
        }}
      />
    );
  }
}

async function sleepFor(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

describe('NumberInputField', () => {
  test('works with forms', async () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(<TestForm onSubmit={onSubmit} />);
    const input = getByTestId('base-input');
    const form = getByTestId('form');
    fireEvent.change(input, { target: { value: 123 } });
    fireEvent.submit(form);

    // FIXME @RafaelVidaurre: Hack to get right post-submit state
    await sleepFor(1);

    expect(onSubmit).toHaveBeenCalledWith({ foo: 123 }, expect.anything());
  });
});
