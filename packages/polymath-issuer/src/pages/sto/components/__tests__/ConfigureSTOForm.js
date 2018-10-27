import React from 'react';
import { render } from 'react-testing-library';
import { ConfigureSTOFormComponent } from '../ConfigureSTOForm';

jest.mock('../ConfigureSTOForm/forms', () => ({
  FooSTO: () => <div>Foo form</div>,
}));

describe('ConfigureSTOFormComponent', () => {
  test("renders a form component depending on the stoModule's type", () => {
    const result = render(
      <ConfigureSTOFormComponent stoModule={{ type: 'FooSTO' }} />
    );
    expect(result.queryByText('Foo form')).not.toBeNull();
  });
});
