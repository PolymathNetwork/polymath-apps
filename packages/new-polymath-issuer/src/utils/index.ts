import { SessionState } from '~/state/reducers/session';
import { SessionRoles, Pojo } from '~/types';
import _ from 'lodash';

/**
 * Returns a session stage based on a given state
 */
export function getSessionStage(state: SessionState): SessionRoles {
  if (!state.wallet) {
    return SessionRoles.Anonymous;
  }

  if (!state.identity) {
    return SessionRoles.LoggedIn;
  }

  if (!state.identity.confirmed) {
    return SessionRoles.UnconfirmedUser;
  }

  return SessionRoles.ConfirmedUser;
}

/**
 * Returns a string hash of a POJO for comparison
 *
 * @param args arguments to hash
 */
export function hashObj(args: Pojo) {
  const sortedKeyArray = _.keys(args).sort();

  return _.join(_.map(sortedKeyArray, key => `${key}:${args[key]}`), ',');
}
