import { polyClient } from '~/lib/polyClient';
import { PolymathClient } from '@polymathnetwork/sdk';

describe('polyClient', () => {
  test('client is instanciated', () => {
    expect(polyClient instanceof PolymathClient).toBeTruthy();
  });
});
