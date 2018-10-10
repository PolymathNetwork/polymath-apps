import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

import Footer from './';

test('renders without crashing', () => {
  const component = renderer.create(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
