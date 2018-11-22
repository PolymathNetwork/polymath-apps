import React from 'react';
import { render } from '../../../../testUtils';

import RaisedAmount from '../RaisedAmount';

test('renders without crashing', () => {
  const { container } = render(
    <RaisedAmount
      title="a title"
      primaryAmount={555}
      primaryUnit="PRIM"
      tokenAmount={111}
      tokenUnit="TOK"
    />
  );

  expect(container.firstChild).toMatchSnapshot();
});
