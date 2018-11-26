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

export default Yup;
