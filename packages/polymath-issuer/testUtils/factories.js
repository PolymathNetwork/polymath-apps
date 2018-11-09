export function securityToken(data) {
  const defaults = {
    ticker: 'FOO',
    name: 'FooToken',
    owner: 'FOOOwnerAddress',
    timestamp: Date.now(),
    address: 'FooTokenAddress',
    txHash: 'Some tx hash',
  };

  return {
    ...defaults,
    ...data,
  };
}

export function cappedSTO(data) {
  const defaults = {
    type: 'CappedSTO',
    address: 'FakeCappedSTOAddress',
    ownerAddress: 'FakeCappedSTOOwnerAddress',
    description: 'CappedSTO Description',
    setupCost: 4567,
  };

  return {
    ...defaults,
    ...data,
  };
}

export function usdTieredSTO(data) {
  const defaults = {
    type: 'USDTieredSTO',
    address: 'FakeUSDTieredSTOAddress',
    ownerAddress: 'FakeUSDTieredSTOOwnerAddress',
    description: 'USDTieredSTO Description',
    setupCost: 1234,
  };

  return {
    ...defaults,
    ...data,
  };
}
