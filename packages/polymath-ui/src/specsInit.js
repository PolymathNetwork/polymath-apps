import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { uiReducer, networkReducer } from './redux/reducer';

const mockStore = configureMockStore([thunk]);

// NOTE @RafaelVidaurre: Not sure when we'd ever need this
global.store = mockStore({
  ui: uiReducer(undefined, {}),
  network: networkReducer(undefined, {}),
});

configure({ adapter: new Adapter() });
