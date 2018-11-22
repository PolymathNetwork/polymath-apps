import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import * as factories from './factories';

const middlewares = [thunk];
export const mockStore = configureMockStore(middlewares);

export { factories };
