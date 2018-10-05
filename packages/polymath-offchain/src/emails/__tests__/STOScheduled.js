import React from 'react';
import renderer from 'react-test-renderer';
import { STOScheduled } from '../STOScheduled';

describe('Component: STOScheduled', () => {
  const ticker = 'SOMETICK';
  const start = new Date('10/14/1987');
  const cap = 1000000;
  const rate = 1000;
  const isPolyFundraise = true;
  const fundsReceiver = '0xffffffffffffffff';
  const txHash = '0xeeeeeeeeeeeeeeee';

  test('renders with all valid props', () => {
    // capRate with no decimals
    let component = renderer.create(
      <STOScheduled
        ticker={ticker}
        start={start}
        cap={cap}
        rate={rate}
        isPolyFundraise={isPolyFundraise}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();

    // capRate with decimals
    component = renderer.create(
      <STOScheduled
        ticker={ticker}
        start={start}
        cap={cap}
        rate={300}
        isPolyFundraise={isPolyFundraise}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
      />
    );

    tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders with invalid capRate', () => {
    // capRate is NaN
    let component = renderer.create(
      <STOScheduled
        ticker={ticker}
        start={start}
        cap={'a'}
        rate={rate}
        isPolyFundraise={isPolyFundraise}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();

    // capRate is Infinity
    component = renderer.create(
      <STOScheduled
        ticker={ticker}
        start={start}
        cap={cap}
        rate={0}
        isPolyFundraise={isPolyFundraise}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
      />
    );

    tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders currency as ETH if isPolyFundraise is false', () => {
    const component = renderer.create(
      <STOScheduled
        ticker={ticker}
        start={start}
        cap={'a'}
        rate={rate}
        isPolyFundraise={false}
        fundsReceiver={fundsReceiver}
        txHash={txHash}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
