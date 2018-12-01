import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { TestComponent } from '../';

test('renders without crashing', () => {
  const component = renderer.create(<TestComponent text={'HELLOOOOO'} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
