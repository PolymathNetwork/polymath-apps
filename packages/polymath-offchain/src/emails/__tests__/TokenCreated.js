import React from 'react';
import renderer from 'react-test-renderer';
import { TokenCreated } from '../TokenCreated';

describe('Component: TokenCreated', () => {
  test('renders with all props', () => {
    const component = renderer.create(
      <TokenCreated
        ticker={'SOMETICKER'}
        txHash={'0xffffffffffffffff'}
        networkId={'15'}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
