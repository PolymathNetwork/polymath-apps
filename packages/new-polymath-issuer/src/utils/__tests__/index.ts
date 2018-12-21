import { getSessionStage, hashObj } from '../index';
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

  describe('hashObj', () => {
    const pojo = {
      bar: false,
      baz: 1,
      foo: 'Foo',
    };

    const unorderedPojo = {
      baz: 1,
      foo: 'Foo',
      bar: false,
    };
    test('should return a string representation of the supplied POJO', () => {
      expect(hashObj(pojo)).toBe('bar:false,baz:1,foo:Foo');
    });

    test('should be agnostic to the order of the properties', () => {
      expect(hashObj(pojo)).toEqual(hashObj(unorderedPojo));
    });
  });
});
