import * as dotenv from 'dotenv';
import { configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import 'jest-styled-components';
import { cleanup } from 'react-testing-library';

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
