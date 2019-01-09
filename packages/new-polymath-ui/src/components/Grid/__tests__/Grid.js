import React from 'react';
import renderer from 'react-test-renderer';

import Grid from '../';

test('renders without crashing', () => {
  const component = renderer.create(
    <Grid gridAutoFlow="column" gridAutoColumns="1fr" alignItems="end">
      <div>First block</div>
      <div>Second block</div>
    </Grid>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
