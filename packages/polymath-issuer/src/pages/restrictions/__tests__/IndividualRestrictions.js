import IndividualRestrictions from '../components/IndividualRestrictions';
import renderer from 'react-test-renderer';
import React from 'react';
import configureStore from 'redux-mock-store';
import { theme, GlobalStyles } from '@polymathnetwork/ui';
import { shallow, mount } from 'enzyme';
import { ThemeProvider } from 'styled-components';
import moment from 'moment';
import { Provider } from 'react-redux';
const mockStore = configureStore([]);

describe('Individual Restrictions Component', () => {
  it('should render correctly', () => {
    const props = {};
    const tree = shallow(<IndividualRestrictions {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
