import React from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { uiReducer, networkReducer } from '../redux/reducer';

import '../style.scss';

const reducers = combineReducers({ ui: uiReducer, network: networkReducer });
const store = createStore(reducers);

const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;

export default Wrapper;
