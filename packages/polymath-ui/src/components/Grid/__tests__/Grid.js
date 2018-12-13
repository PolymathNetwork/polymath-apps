import React from 'react';
import { render } from '../../../../testUtils';

import Grid from '../';

test('renders without crashing', () => {
  const { container } = render(
    <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
      <div>First block</div>
      <div>Second block</div>
    </Grid>
  );

  expect(container.firstChild).toMatchSnapshot();
});
