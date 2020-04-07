import { CompliancePage } from '../CompliancePage';
import ConnectedCompliancePage from '../CompliancePage';
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
  it('should render NotFoundPage when there is no token', () => {
    const props = {
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchApprovals: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
    expect(props.fetchWhitelist).toHaveBeenCalled();
    expect(props.fetchManagers).toHaveBeenCalled();
    expect(props.fetchApprovals).toHaveBeenCalled();
    expect(props.fetchPartialTransfers).toHaveBeenCalled();
  });

  it('should render correctly when token address is present', () => {
    const props = {
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchApprovals: jest.fn(),
      fetchPartialTransfers: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
    expect(props.fetchWhitelist).toHaveBeenCalled();
    expect(props.fetchManagers).toHaveBeenCalled();
    expect(props.fetchApprovals).toHaveBeenCalled();
    expect(props.fetchPartialTransfers).toHaveBeenCalled();
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

  it('should render Approval Table when MATM is enabled', () => {
    const props = {
      isApprovalToggled: true,
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchApprovals: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    expect(tree).toMatchSnapshot();
    expect(props.fetchWhitelist).toHaveBeenCalled();
    expect(props.fetchManagers).toHaveBeenCalled();
    expect(props.fetchApprovals).toHaveBeenCalled();
  });

  it('should add approval module when handleToggleApproval is given true', () => {
    const props = {
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
      addManualApprovalModule: jest.fn(),
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchApprovals: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    const instance = tree.instance();
    instance.handleToggleApproval(true);
    expect(props.addManualApprovalModule).toHaveBeenCalled();
  });

  it('should archive approval module when handleToggleApproval is given false', () => {
    const props = {
      token: {
        address: '0x121212',
        contract: {
          version: '3.0.0',
        },
      },
      archiveManualApprovalModule: jest.fn(),
      fetchWhitelist: jest.fn(),
      fetchManagers: jest.fn(),
      fetchApprovals: jest.fn(),
      theme,
    };
    const tree = shallow(<CompliancePage {...props} />);
    const instance = tree.instance();
    instance.handleToggleApproval(false);
    expect(props.archiveManualApprovalModule).toHaveBeenCalled();
  });
});
