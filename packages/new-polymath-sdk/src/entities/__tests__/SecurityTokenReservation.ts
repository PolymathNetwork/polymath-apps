import { SecurityTokenReservation } from '../SecurityTokenReservation';
import { Polymath } from '~/Polymath';

const params = {
  symbol: 'TEST',
  name: 'Test Token',
};

jest.mock('~/Polymath');

const polyClient = new Polymath({} as any);

describe('SecurityTokenReservation', () => {
  describe('.constructor', () => {
    test('instanciates correctly', () => {
      const reservation = new SecurityTokenReservation(
        params,
        polyClient as Polymath
      );
      expect(reservation).toBeDefined();
      expect(reservation.name).toBeDefined();
      expect(reservation.symbol).toBeDefined();
    });
  });

  // TODO @RafaelVidaurre: Create a test helper for this common pattern
  describe('#reserve', async () => {
    test('forwards args to the global function', async () => {
      (polyClient.reserveSecurityToken as any).mockImplementationOnce(() => {});

      const reservation = new SecurityTokenReservation(params, polyClient);
      await reservation.reserve({});

      expect(polyClient.reserveSecurityToken).toHaveBeenCalledWith(
        expect.objectContaining({
          symbol: reservation.symbol,
          name: reservation.name,
        })
      );
    });
  });
});
