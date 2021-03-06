import React from 'react';
import renderer from 'react-test-renderer';
import { TickerReserved } from '../TickerReserved';

describe('Component: TickerReserved', () => {
  const txHash = '0xffffffffffffffff';
  const ticker = 'SOMETICKER';
  const expiryLimit = 15;
  const networkId = '15';

  test('renders with all props', () => {
    const component = renderer.create(
      <TickerReserved
        txHash={txHash}
        ticker={ticker}
        expiryLimit={expiryLimit}
        networkId={networkId}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
