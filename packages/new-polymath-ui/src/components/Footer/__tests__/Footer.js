import React from 'react';
import { MemoryRouter } from 'react-router';

import { render } from '../../../../testUtils';

import Footer from '../Footer';

test('renders without crashing', () => {
  const { container } = render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

  expect(container.firstChild).toMatchSnapshot();
});
