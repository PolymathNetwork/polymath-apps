import RestrictionDetails from '../components/RestrictionDetails';
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

describe('Restriction Details Component', () => {
  it('should render with the details', () => {
    const props = {
      restriction: {
        startTime: moment.unix(1),
        endTime: moment(1),
        allowedTokens: 500,
        restrictionType: 0,
      },
    };
    const tree = shallow(<RestrictionDetails {...props} />);
    expect(tree).toMatchSnapshot();
  });
  it('should render a percentage when restrictionType is 1', () => {
    const props = {
      restriction: {
        startTime: moment.unix(1),
        endTime: moment(1),
        allowedTokens: 0.1,
        restrictionType: 1,
      },
    };
    const tree = shallow(<RestrictionDetails {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
