import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';

import EthNetworkWrapper from '../EthNetworkWrapper';

test('renders without crashing', () => {
  const component = renderer.create(
    <Provider store={global.store}>
      <EthNetworkWrapper loading={null} />
    </Provider>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
