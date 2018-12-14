import { polyClient } from '~/lib/polyClient';
import { PolymathClient } from '@polymathnetwork/sdk';

describe('polyClient', () => {
  // TODO @RafaelVidaurre: Enable this test one we stop using the mock
  test.skip('client is instanciated at design time', () => {
    expect(polyClient instanceof PolymathClient).toBeTruthy();
  });
});
