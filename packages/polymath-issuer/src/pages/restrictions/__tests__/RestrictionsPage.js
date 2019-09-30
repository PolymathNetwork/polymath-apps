import { RestrictionsPage } from '../RestrictionsPage';
import DefaultRestrictionsPage from '../RestrictionsPage';
import renderer from 'react-test-renderer';
import React from 'react';
import configureStore from 'redux-mock-store';
import { theme, GlobalStyles } from '@polymathnetwork/ui';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import moment from 'moment';
import { Provider } from 'react-redux';
const mockStore = configureStore([]);

describe('Restrictions Page', () => {
  it('should render not found when there is no token', () => {
    const props = {
      getVolumeRestrictionModule: jest.fn(),
      theme,
    };
    const tree = shallow(<RestrictionsPage {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render the page with VRTM disabled', () => {
    const props = {
      getVolumeRestrictionModule: jest.fn(),
      token: {
        address: '0x121212',
      },
      theme,
    };
    const tree = shallow(<RestrictionsPage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render global restrictions tab when VRTM is enabled', () => {
    const props = {
      getVolumeRestrictionModule: jest.fn(),
      isRestrictionsToggled: true,
      token: {
        address: '0x121212',
      },
      theme,
    };
    const tree = shallow(<RestrictionsPage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render global default restrictions when VRTM is enabled', () => {
    const props = {
      getVolumeRestrictionModule: jest.fn(),
      dailyRestrictionModified: true,
      dailyRestriction: {
        startTime: moment(1),
        endTime: moment(1),
        allowedTokens: 500,
        restrictionType: 0,
      },
      isRestrictionsToggled: true,
      token: {
        address: '0x121212',
      },
      theme,
    };
    const tree = shallow(<RestrictionsPage {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render global daily restrictions when VRTM is enabled', () => {
    const props = {
      getVolumeRestrictionModule: jest.fn(),
      defaultRestrictionModified: true,
      defaultRestriction: {
        startTime: moment.unix(1),
        endTime: moment(1),
        allowedTokens: 500,
        restrictionType: 0,
      },
      isRestrictionsToggled: true,
      token: {
        address: '0x121212',
      },
      theme,
    };
    const store = mockStore({
      token: {
        address: '0x121212',
      },
    });
    const tree = shallow(<RestrictionsPage {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
