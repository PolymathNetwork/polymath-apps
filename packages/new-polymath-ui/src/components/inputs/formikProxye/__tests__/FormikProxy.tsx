import React, { FC } from 'react';
import { fireEvent } from 'react-testing-library';
import { FormikProxy, RenderProps, FormikExternalProps } from '../index';
import { render } from '~/testUtils/helpers';

const MockInput: FC<RenderProps<string>> = ({
  onChange,
  onBlur,
  name,
  value,
}) => (
  <input
    data-testid="mock-input"
    type="text"
    onChange={evt => onChange(evt.target.value)}
    onBlur={evt => onBlur()}
    name={name}
    value={value}
  />
);

describe('FormikProxy Enhancer', () => {
  let props: FormikExternalProps;
  let Input: FC;

  beforeEach(() => {
    props = {
      field: {
        name: 'foo',
        value: 'someValue',
      },
      form: {
        setFieldValue: jest.fn(),
        setFieldTouched: jest.fn(),
      },
    };

    Input = () => (
      <FormikProxy<string>
        {...props}
        render={formikProps => <MockInput {...formikProps} />}
      />
    );
  });

  test('sets field value on change', () => {
    const { getByTestId } = render(<Input />);
    const input = getByTestId('mock-input');

    fireEvent.change(input, { target: { value: 'newValue' } });

    expect(props.form.setFieldValue).toHaveBeenCalledWith('foo', 'newValue');
  });

  test('sets field touched on blur', () => {
    const { getByTestId } = render(<Input />);
    const input = getByTestId('mock-input');

    fireEvent.blur(input);

    expect(props.form.setFieldTouched).toHaveBeenCalledWith('foo', true);
  });
});
