import moment from 'moment';
import {
  validWhitelistCsv,
  invalidWhitelistCsv,
} from '../../../../testUtils/fixtures/csvFiles';
import { parseWhitelistCsv, validateWhitelistCsv } from '../index';

describe('parsers', () => {
  describe('parseWhitelistCsv', () => {
    test('parses the file correctly', () => {
      const result = parseWhitelistCsv(validWhitelistCsv);
      expect(result.data[0]).toEqual({
        address: '0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1',
        sellLockupDate: moment({ month: 0, day: 1, year: 2022 }).toDate(),
        buyLockupDate: moment({ month: 5, day: 4, year: 2024 }).toDate(),
        kycAmlExpiryDate: moment({ month: 0, day: 1, year: 2021 }).toDate(),
        canBuyFromSto: true,
        bypassesOwnershipRestriction: true,
        accredited: true,
        nonAccreditedLimit: null,
      });
      expect(result.invalidRows).toHaveLength(0);
    });

    test('returns a list of invalid rows', () => {
      const result = parseWhitelistCsv(invalidWhitelistCsv);
      expect(result.invalidRows).not.toHaveLength(0);
    });
  });

  describe('validateWhitelistCsv', () => {
    const sampleCsvRow = {
      address: '0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1',
      sellLockupDate: new Date('11/11/2018'),
      buyLockupDate: new Date('11/10/2018'),
      kycAmlExpiryDate: new Date('11/10/2022'),
      canBuyFromSto: true,
    };
    test('checks for invalid addresses', () => {
      const csv = [
        {
          ...sampleCsvRow,
          address: 'badAddress',
        },
      ];
      const invalidRows = validateWhitelistCsv(csv);
      expect(invalidRows).toHaveLength(1);
    });

    test('checks for duplicated addresses', () => {
      const csv = [
        {
          ...sampleCsvRow,
          address: '0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1',
        },
        {
          ...sampleCsvRow,
          address: '0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1',
        },
      ];

      const invalidRows = validateWhitelistCsv(csv);
      expect(invalidRows).toHaveLength(2);
    });

    test('checks for invalid valid dates', () => {
      const csv = [{ ...sampleCsvRow, buyLockupDate: 'notADate' }];
      const invalidRows = validateWhitelistCsv(csv);
      expect(invalidRows).toHaveLength(1);
    });

    test('checks for unexpected values', () => {
      const csv = [{ ...sampleCsvRow, isAccredited: 1234 }];
      const invalidRows = validateWhitelistCsv(csv);
      expect(invalidRows).toHaveLength(1);
    });
  });
});
