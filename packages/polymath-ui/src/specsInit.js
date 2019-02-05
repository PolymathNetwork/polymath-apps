import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import dotenv from 'dotenv';
import { cleanup } from 'react-testing-library';
import 'jest-styled-components';

const res = dotenv.config({ path: '.env.test' });

// Override environment variables since we are in test mode and need to isolate them
process.env = {
  ...process.env,
  ...res.parsed,
};

if (res.error) {
  throw res.error;
}

afterEach(() => {
  cleanup();
});

configure({ adapter: new Adapter() });
