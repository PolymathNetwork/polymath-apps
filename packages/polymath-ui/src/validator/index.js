import * as Yup from 'yup';
import Web3 from 'web3';
import { BigNumberSchema } from './types/BigNumberSchema.js';

Yup.bigNumber = () => new BigNumberSchema();

Yup.addMethod(Yup.mixed, 'isRequired', function(message) {
  return this.required(message).typeError(message);
});

Yup.addMethod(Yup.string, 'isAddress', function(message) {
  return this.test('validateIsAddress', function(value) {
    if (!Web3.utils.isAddress(value)) {
      return this.createError({
        message,
      });
    }

    return true;
  });
});

Yup.addMethod(Yup.string, 'isEmail', function(message) {
  const emailRegex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z0-9-]+$/i;

  return this.test('validateIsEmail', function(value) {
    return emailRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

Yup.addMethod(Yup.string, 'isUrl', function(message) {
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;

  return this.test('validateIsUrl', function(value) {
    return urlRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

export default Yup;
