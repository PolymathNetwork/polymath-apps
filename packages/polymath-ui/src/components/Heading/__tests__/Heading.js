import React from 'react';
import { render } from '../../../../testUtils';

import Heading from '../';

test('renders without crashing', () => {
  const { container } = render(<Heading>This is a Heading.</Heading>);
  expect(container.firstChild).toMatchSnapshot();
});
