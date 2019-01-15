import { fork, take, call, Pattern, HelperFunc0 } from 'redux-saga/effects';
import { Action } from 'redux';

export const takeOneAtATime = <A extends Action>(
  patternOrChannel: Pattern,
  saga: HelperFunc0<A>
) =>
  fork(function*() {
    while (true) {
      const action: A = yield take(patternOrChannel);
      yield call(saga, action);
    }
  });
