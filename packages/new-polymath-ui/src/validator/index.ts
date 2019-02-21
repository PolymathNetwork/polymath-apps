import * as Yup from 'yup';
import { isValidAddress } from '@polymathnetwork/sdk';
import { BigNumberSchema } from './schemas/BigNumberSchema';

const validator: typeof Yup & { bigNumber: () => BigNumberSchema } = {
  ...Yup,
  bigNumber: () => new BigNumberSchema(),
};

validator.bigNumber = () => new BigNumberSchema();

validator.addMethod(Yup.mixed, 'isRequired', function(message) {
  return this.required(message).typeError(message);
});

validator.addMethod(validator.string, 'isAddress', function(message) {
  return this.test('validateIsAddress', message, function(value) {
    if (!isValidAddress(value)) {
      return this.createError({
        message,
      });
    }

    return true;
  });
});

validator.addMethod(validator.string, 'isEmail', function(message) {
  const emailRegex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z0-9-]+$/i;

  return this.test('validateIsEmail', message, function(value) {
    return !value || emailRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

validator.addMethod(validator.string, 'isUrl', function(message) {
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;

  return this.test('validateIsUrl', message, function(value) {
    return !value || urlRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

export { validator };
