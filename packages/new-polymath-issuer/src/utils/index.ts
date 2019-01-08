import { SessionState } from '~/state/reducers/session';
import { SessionRoles } from '~/types';
import { types } from '@polymathnetwork/new-shared';
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
