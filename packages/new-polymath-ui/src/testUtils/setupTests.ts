import 'babel-polyfill';
import 'jest-dom/extend-expect';
import 'jest-styled-components';
import { cleanup } from '~/testUtils/helpers';

// We mock this module since it cannot be parsed and is ignored by jests transformer for some reason
jest.mock('typeface-overpass', () => ({}));

// Unmounts React trees that were mounted with render.
afterEach(cleanup);
