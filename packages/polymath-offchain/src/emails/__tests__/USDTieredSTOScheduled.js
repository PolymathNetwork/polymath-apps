import React from 'react';
import renderer from 'react-test-renderer';
import { USDTieredSTOScheduled } from '../USDTieredSTOScheduled';

describe('Component: USDTieredSTOScheduled', () => {
  const ticker = 'SOMETICK';
  const start = new Date('10/14/1987');
  const fundsReceiver = '0xffffffffffffffff';
  const txHash = '0xeeeeeeeeeeeeeeee';
  const networkId = '15';

  test('renders with all valid props', () => {
    let component = renderer.create(
      <USDTieredSTOScheduled
        ticker={ticker}
        start={start}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
        networkId={networkId}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
