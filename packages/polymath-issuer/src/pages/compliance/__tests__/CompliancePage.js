import { CompliancePage } from '../CompliancePage';
import DefaultCompliancePage from '../CompliancePage';
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

describe('Compliance Page', () => {
  it('should render not found when there is no token', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should not render RPTM tab when token version below 3.0.0', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
      token: {
        address: '0x121212',
        contract: {
          version: '2.9.0',
        },
      },
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should call addPartialTM when toggle is set to true', async () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      addPartialTM: jest.fn(),
      archivePartialTM: jest.fn(),
      theme,
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
    };
    const tree = shallow(<CompliancePage {...props} />);
    await tree.instance().handleTogglePartialTransfer(true);
    expect(props.addPartialTM).toHaveBeenCalled();
    expect(props.archivePartialTM.mock.calls.length).toBe(0);
  });

  it('should call archivePartialTM when toggle is set to false', async () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      addPartialTM: jest.fn(),
      archivePartialTM: jest.fn(),
      theme,
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
    };
    const tree = shallow(<CompliancePage {...props} />);
    await tree.instance().handleTogglePartialTransfer(false);
    expect(props.archivePartialTM).toHaveBeenCalled();
    expect(props.addPartialTM.mock.calls.length).toBe(0);
  });

  it('should show PartialTransferTable when RPTM is enabled', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      addPartialTM: jest.fn(),
      archivePartialTM: jest.fn(),
      theme,
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
