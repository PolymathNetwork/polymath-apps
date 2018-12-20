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

  describe('#reserve', async () => {
    (polyClient.reserveSecurityToken as any).mockImplementationOnce(() => {});

    const reservation = new SecurityTokenReservation(params, polyClient);
    const sequence = await reservation.reserve({});

    expect(polyClient.reserveSecurityToken).toHaveBeenCalled();
  });
});
