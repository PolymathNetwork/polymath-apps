import '../../startup/setupEnvironment';

import React from 'react';
import renderer from 'react-test-renderer';
import { TickerReserved } from '../TickerReserved';

describe('Component: TickerReserved', () => {
  const txHash = '0xffffffffffffffff';
  const ticker = 'SOMETICKER';
  const expiryLimit = 15;

  test('renders with all props', () => {
    const component = renderer.create(
      <TickerReserved
        txHash={txHash}
        ticker={ticker}
        expiryLimit={expiryLimit}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
