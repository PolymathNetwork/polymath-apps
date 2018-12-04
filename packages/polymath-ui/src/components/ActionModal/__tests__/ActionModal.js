import React from 'react';
import { render } from '../../../../testUtils';

import ActionModal from '../';

test('renders without crashing', () => {
  const { container } = render(
    <ActionModal isOpen actionButtonText="Button Text" onSubmit={() => {}}>
      <ActionModal.Header>A title</ActionModal.Header>
      Some content.
    </ActionModal>
  );

  expect(container.firstChild).toMatchSnapshot();
});
