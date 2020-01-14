import { PartialTransferTable } from '../components/PartialTransferTable';
import DefaultPartialTransferTable from '../components/PartialTransferTable';
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
    const tree = shallow(<PartialTransferTable {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should set state to open when handleOpen is triggered', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<PartialTransferTable {...props} />);
    tree.instance().handleOpen();
    expect(tree.state().isPartialTransferModalOpen).toBe(true);
  });

  it('should set state to closed when handleClose is triggered', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<PartialTransferTable {...props} />);
    tree.instance().handleClose();
    expect(tree.state().isPartialTransferModalOpen).toBe(false);
  });

  it('should call function to delete the address(id)', () => {
    const id = '0x121212';
    const props = {
      removeAddressFromPartialExempt: jest.fn(),
      theme,
    };
    const tree = shallow(<PartialTransferTable {...props} />);
    tree.instance().handleDelete(id);
    expect(props.removeAddressFromPartialExempt).toHaveBeenCalledWith(id);
  });
});
