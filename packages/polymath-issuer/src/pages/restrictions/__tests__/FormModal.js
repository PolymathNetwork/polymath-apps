import FormModal from '../components/FormModal';
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
  it('should render 24h title', () => {
    const props = {
      restrictionType: '24h',
    };
    const tree = shallow(<FormModal {...props} />);
    expect(tree).toMatchSnapshot();
  });

  it('should render custom title', () => {
    const props = {
      restrictionType: 'custom',
    };
    const tree = shallow(<FormModal {...props} />);
    expect(tree).toMatchSnapshot();
  });
});
