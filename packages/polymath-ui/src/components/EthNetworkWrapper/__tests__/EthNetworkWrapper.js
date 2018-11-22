import React from 'react';
import { Provider } from 'react-redux';
import { render, mockStore } from '../../../../testUtils';
import { networkReducer } from '../../..//redux/reducer';
import EthNetworkWrapper from '../EthNetworkWrapper';

describe('EthNetworkWrapper', () => {
  test('renders without crashing', () => {
    // const store = mockStore({ network: networkReducer(undefined, {}) });
    // const loadingContent = <div>Loading...</div>;
    // const container = render(
    //   <Provider store={store}>
    //     <EthNetworkWrapper loading={loadingContent} />
    //   </Provider>
    // );
    // TODO @RafaelVidaurre: Tests pending here
  });
});
