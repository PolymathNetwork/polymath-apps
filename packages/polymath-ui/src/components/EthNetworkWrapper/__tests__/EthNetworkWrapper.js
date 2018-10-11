import React from 'react';
import renderer from 'react-test-renderer';

import { EthNetworkWrapper } from '../EthNetworkWrapper';

// TODO @RafaelVidaurre: Add missing tests
describe('EthNetworkWrapper', () => {
  test('renders without crashing', () => {
    const loadingContent = <div>Loading...</div>;
    const component = renderer.create(
      <EthNetworkWrapper loading={loadingContent} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
