import React from 'react';
import renderer from 'react-test-renderer';

import { EthNetworkWrapper } from '../EthNetworkWrapper';

// NOTE @RafaelVidaurre: Muted this test as it is tackled in the 2.0 branch
describe('EthNetworkWrapper', () => {
  test.skip('renders without crashing', () => {
    const loadingContent = <div>Loading...</div>;
    const component = renderer.create(
      <EthNetworkWrapper loading={loadingContent} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
