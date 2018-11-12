import csvParse from 'csv-parse/lib/sync';
import moment from 'moment';

export function parseWhitelistCsv(file: string) {
  const parsedCsv = csvParse(file, {
    cast: (value, context) => {
      if (value === '') {
        return null;
      }
      if (value.toLocaleLowerCase() === 'true') {
        return true;
      }
      if (value.split('/').length === 3) {
        const [rawMonth, day, rawYear] = value.split('/');
        // Months are 0-based
        const month = parseInt(rawMonth, 10) - 1;
        let year = parseInt(rawYear, 10);

        // Support for incomplete years
        if (year < 2000) {
          year += 2000;
        }
        return moment({ month, day, year }).toDate();
      }
      if (!isNaN(value)) {
        return parseFloat(value);
      }

      return value;
    },
    columns: line => {
      return [
        'address',
        'sellLockupDate',
        'buyLockupDate',
        'kycAmlExpiryDate',
        'canBuyFromSto',
        'bypassesOwnershipRestriction',
        'accredited',
        'nonAccreditedLimit',
      ];
    },
  });

  return parsedCsv;
}
