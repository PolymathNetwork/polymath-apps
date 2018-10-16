import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import dotenv from 'dotenv';

const res = dotenv.config({ path: './.env.test' });

if (res.error) {
  throw res.error;
}

configure({ adapter: new Adapter() });
