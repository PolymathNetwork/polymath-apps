import '@babel/polyfill';
import dotenv from 'dotenv';
import { cleanup } from 'react-testing-library';
import { mockEthereumBrowser } from './helpers';

// Avoid breaking tests trying to import third party css
jest.mock('typeface-overpass', () => ({}));
jest.mock('simplebar/dist/simplebar.css', () => ({}));

const res = dotenv.config({ path: './config/.env.tests' });

// Override environment variables since we are in test mode and need to isolate them
process.env = {
  ...process.env,
  ...res.parsed,
};

mockEthereumBrowser();

afterEach(cleanup);
