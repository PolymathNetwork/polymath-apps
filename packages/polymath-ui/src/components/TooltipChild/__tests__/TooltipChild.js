import React from 'react';
import { render } from '../../../../testUtils';

import TooltipChild from '../TooltipChild';

test('renders without crashing', () => {
  const { container } = render(
    <TooltipChild tooltipContent="Hover the item!">
      This is a Tooltip.
    </TooltipChild>
  );

  expect(container.firstChild).toMatchSnapshot();
});
