import validWhitelistCsv from '../../../../testUtils/fixtures/valid-whitelist';
import { parseWhitelistCsv } from '../index';

describe('parsers', () => {
  describe('parseWhitelistCsv', () => {
    test('parses the file correctly', () => {
      const result = parseWhitelistCsv(validWhitelistCsv);
      expect(result).toMatchSnapshot();
    });
  });
});
