import '@babel/polyfill';
import { cleanup } from 'react-testing-library';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });
afterEach(cleanup);
