import 'babel-polyfill';

// We bock this module since it cannot be parsed and is ignored by jests transformer for some reason
jest.mock('typeface-overpass', () => ({}));
