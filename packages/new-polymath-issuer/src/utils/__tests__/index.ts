import { getSessionStage } from '../index';
import { SessionRoles } from '~/types';

describe('Utils', () => {
  describe('.getSessionStage', () => {
    test('returns Anonymous if no wallet is set', () => {
      expect(getSessionStage({})).toEqual(SessionRoles.Anonymous);
    });

    test('returns LoggedIn if a wallet is set without identity', () => {
      expect(getSessionStage({ wallet: { address: 'somewallet' } })).toEqual(
        SessionRoles.LoggedIn
      );
    });

    test('returns UnconfirmedUser if an identity is set but not confirmed', () => {
      expect(
        getSessionStage({
          wallet: { address: 'somewallet' },
          identity: {
            fullName: 'Foo bar',
            email: 'foo@bar.com',
            confirmed: false,
          },
        })
      ).toEqual(SessionRoles.UnconfirmedUser);
    });

    test('returns ConfirmedUser if an identity is set and confirmed', () => {
      expect(
        getSessionStage({
          wallet: { address: 'somewallet' },
          identity: {
            fullName: 'Foo bar',
            email: 'foo@bar.com',
            confirmed: true,
          },
        })
      ).toEqual(SessionRoles.ConfirmedUser);
    });
  });
});
