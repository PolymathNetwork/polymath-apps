export default function mockDate({ year = 2017, month = 9, day = 16 }) {
  const globalDate = global.Date;
  global.Date = class MockDate extends Date {
    constructor() {
      super();
      this.setFullYear(year);
      this.setMonth(month);
      this.setDate(day);
    }
  };
  global.Date.mockRestore = () => (global.Date = globalDate);
}
