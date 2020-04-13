import { PartialTransferModal } from '../components/PartialTransferModal';
import DefaultPartialTransferModal from '../components/PartialTransferModal';
import renderer from 'react-test-renderer';
import React from 'react';
import configureStore from 'redux-mock-store';
import { theme, GlobalStyles } from '@polymathnetwork/ui';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';
const mockStore = configureStore([]);
moment.tz.setDefault('America/New_York');

describe('Partial Transfer Modal', () => {
  it('should render correctly', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<PartialTransferModal {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
