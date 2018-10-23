import React from 'react';
import { ThemeProvider } from 'styled-components';
// import { Provider } from 'react-redux';
// import { createStore, combineReducers } from 'redux';

// TODO @grsmto: we can't include this wrapper before it imports some polymath-js dependencies that break Docz build. Need to investigate why this is happening.

// import { uiReducer, networkReducer } from '../redux/reducer';

import '../styles/globals.scss';

import theme from '../theme';

// const reducers = combineReducers({ ui: uiReducer, network: networkReducer });
// const store = createStore(reducers);

// const Wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
const Wrapper = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default Wrapper;
