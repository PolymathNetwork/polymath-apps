import React from 'react';
import { render } from '../../../../testUtils';

import Tooltip from '../Tooltip';

test('renders without crashing', () => {
  const { container } = render(
    <Tooltip triggerText="Hover the icon!">This is a Tooltip.</Tooltip>
  );

  expect(container.firstChild).toMatchSnapshot();
});
