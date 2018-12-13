import React from 'react';
import { render } from '../../../../testUtils';

import Box from '../';

test('renders without crashing', () => {
  const { container } = render(<Box>This is a box.</Box>);
  expect(container.firstChild).toMatchSnapshot();
});
