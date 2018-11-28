import * as Yup from 'yup';
import BigNumber from 'bignumber.js';

export class BigNumberSchema extends Yup.mixed {
  constructor() {
    super({ type: 'bignumber' });

    this.transforms.push(function(value) {
      if (this.isType(value)) return value;

      try {
        return new BigNumber(value);
      } catch (err) {
        return 'Invalid BigNumber';
      }
    });
  }

  _typeCheck(value) {
    if (value === null) {
      return true;
    }

    return value && (value.isBigNumber || value._isBigNumber);
  }

  min(min, message) {
    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: { min },
      test(value) {
        return (
          value === null || value.isGreaterThanOrEqualTo(this.resolve(min))
        );
      },
    });
  }

  max(max, message) {
    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: { max },
      test(value) {
        return value === null || value.isLessThanOrEqualTo(this.resolve(min));
      },
    });
  }

  lessThan(less, message) {
    return this.test({
      message,
      name: 'lessThan',
      exclusive: true,
      params: { less },
      test(value) {
        return value === null || value.isLessThan(this.resolve(less));
      },
    });
  }

  moreThan(more, message) {
    return this.test({
      message,
      name: 'moreThan',
      exclusive: true,
      params: { more },
      test(value) {
        return value === null || value.isGreaterThan(this.resolve(more));
      },
    });
  }

  postive(message) {
    return this.moreThan(0, message);
  }

  negative(message) {
    return this.lessThan(0, message);
  }

  required(message) {
    return this.test({
      message,
      name: 'required',
      exclusive: true,
      test(value) {
        return value !== null;
      },
    });
  }
}
