import React from 'react';
import { render } from '../../../../testUtils';

import RaisedAmount from '../RaisedAmount';

test('renders without crashing', () => {
  const { container } = render(
    <RaisedAmount title="a title" primaryAmount={555} tokenAmount={111} />
  );

  expect(container.firstChild).toMatchSnapshot();
});
