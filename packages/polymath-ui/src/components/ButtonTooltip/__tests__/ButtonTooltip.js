import React from 'react';
import { render } from '../../../../testUtils';

import ButtonTooltip from '../ButtonTooltip';

test('renders without crashing', () => {
  const { container } = render(
    <ButtonTooltip triggerText="Hover the button!">
      This is a Tooltip.
    </ButtonTooltip>
  );

  expect(container.firstChild).toMatchSnapshot();
});
