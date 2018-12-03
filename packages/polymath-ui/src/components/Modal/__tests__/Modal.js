import React from 'react';
import { render } from '../../../../testUtils';

import Modal from '..';

test('renders without crashing', () => {
  const { container } = render(
    <Modal isOpen>
      <Modal.Header>A title</Modal.Header>
      <Modal.Body>A body</Modal.Body>
      <Modal.Footer>A footer</Modal.Footer>
    </Modal>
  );

  expect(container.firstChild).toMatchSnapshot();
});
