import '../../startup/setupEnvironment';

import React from 'react';
import renderer from 'react-test-renderer';
import { AccountConfirmation } from '../AccountConfirmation';

describe('Component: AccountConfirmation', () => {
  test('renders without crashing', () => {
    const component = renderer.create(
      <AccountConfirmation pin={'202bb23326ce5624'} />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
