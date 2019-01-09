import React from 'react';
import renderer from 'react-test-renderer';

import { Box } from '../';

test('renders without crashing', () => {
  const component = renderer.create(<Box>This is a box.</Box>);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
