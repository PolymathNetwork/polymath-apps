import * as Yup from 'yup';
import { isValidAddress } from '@polymathnetwork/sdk';
import { BigNumberSchema } from './schemas/BigNumberSchema';
import { typeHelpers } from '@polymathnetwork/new-shared';

type ValidatorFn<T> = (
  message?:
    | string
    | ((params: object & Partial<Yup.TestMessageParams>) => string)
    | undefined
) => T;

interface CustomStringSchema extends Yup.StringSchema {
  isEthereumAddress: ValidatorFn<this>;
  required: ValidatorFn<this>;
}

interface CustomStringSchemaConstructor extends Yup.StringSchemaConstructor {
  (): CustomStringSchema;
  new (): CustomStringSchema;
}

type ExtendedYupType = typeHelpers.Omit<typeof Yup, 'string'> & {
  string: CustomStringSchemaConstructor;
  bigNumber: () => BigNumberSchema;
};

const yupValidator: (typeof Yup) & {
  string: Yup.StringSchemaConstructor;
  bigNumber(): BigNumberSchema;
} = {
  ...Yup,
  bigNumber: () => new BigNumberSchema(),
};

yupValidator.bigNumber = () => new BigNumberSchema();

yupValidator.addMethod(Yup.mixed, 'isRequired', function(message) {
  return this.required(message).typeError(message);
});

yupValidator.addMethod(yupValidator.string, 'isEthereumAddress', function(
  message = 'Address is invalid'
) {
  return this.test('validateIsEthereumAddress', message, function(value) {
    if (!isValidAddress(value)) {
      this.createError({
        message,
      });
    }

    return true;
  });
});

yupValidator.addMethod(yupValidator.string, 'isEmail', function(message) {
  const emailRegex = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z0-9-]+$/i;

  return this.test('validateIsEmail', message, function(value) {
    return !value || emailRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

yupValidator.addMethod(yupValidator.string, 'isUrl', function(message) {
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/i;

  return this.test('validateIsUrl', message, function(value) {
    return !value || urlRegex.test(value)
      ? true
      : this.createError({
          message,
        });
  });
});

const validator = yupValidator as ExtendedYupType;

export { validator };
