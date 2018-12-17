import * as sagas from '~/state/sagas/router';

describe('router sagas', () => {
  describe('routerWatcher', () => {
    test('changingRoute is set to true while processing', () => {
      const gen = sagas.routerWatcher();
      const value = gen.next();
      console.log('value', value);
    });

    test.skip('redirects to /notFound if no matching Page is found', () => {});

    test.skip('runs a handler saga if configured for the route', () => {});
  });
});
