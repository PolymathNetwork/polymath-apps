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

interface CustomSchema {
  isRequired: ValidatorFn<this>;
}

interface CustomStringSchema extends Yup.StringSchema, CustomSchema {
  isEthereumAddress: ValidatorFn<this>;
  isRequired: ValidatorFn<this>;
  required: ValidatorFn<this>;
  isEmail: ValidatorFn<this>;
  isUrl: ValidatorFn<this>;
}

interface CustomStringSchemaConstructor extends Yup.StringSchemaConstructor {
  (): CustomStringSchema;
  new (): CustomStringSchema;
}

interface CustomMixedSchema extends Yup.MixedSchema, CustomSchema {}

interface CustomMixedSchemaConstructor extends Yup.MixedSchemaConstructor {
  (): CustomMixedSchema;
  new (): CustomMixedSchema;
}

interface CustomBigNumberSchema extends BigNumberSchema, CustomSchema {}

type ExtendedYupType = typeHelpers.Omit<typeof Yup, 'string' | 'mixed'> & {
  string: CustomStringSchemaConstructor;
  mixed: CustomMixedSchemaConstructor;
  bigNumber: () => CustomBigNumberSchema;
};

const yupValidator: (typeof Yup) & {
  string: Yup.StringSchemaConstructor;
  mixed: Yup.MixedSchemaConstructor;
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
      return this.createError({
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
