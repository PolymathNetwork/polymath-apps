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

interface CustomNumberSchema extends Yup.NumberSchema, CustomSchema {}

interface CustomNumberSchemaConstructor extends Yup.NumberSchemaConstructor {
  (): CustomNumberSchema;
  new (): CustomNumberSchema;
}

interface CustomDateSchema extends Yup.DateSchema, CustomSchema {}

interface CustomDateSchemaConstructor extends Yup.DateSchemaConstructor {
  (): CustomDateSchema;
  new (): CustomDateSchema;
}

interface CustomBooleanSchema extends Yup.BooleanSchema, CustomSchema {}

interface CustomBooleanSchemaConstructor extends Yup.BooleanSchemaConstructor {
  (): CustomBooleanSchema;
  new (): CustomBooleanSchema;
}

interface CustomArraySchema<T> extends Yup.ArraySchema<T>, CustomSchema {}

interface CustomArraySchemaConstructor extends Yup.ArraySchemaConstructor {
  <T>(schema?: Yup.Schema<T>): CustomArraySchema<T>;
  new (): CustomArraySchema<{}>;
}

interface CustomMixedSchema extends Yup.MixedSchema, CustomSchema {}

interface CustomMixedSchemaConstructor extends Yup.MixedSchemaConstructor {
  (): CustomMixedSchema;
  new (): CustomMixedSchema;
}

interface CustomBigNumberSchema extends BigNumberSchema, CustomSchema {}

type ExtendedYupType = typeHelpers.Omit<
  typeof Yup,
  'string' | 'mixed' | 'number' | 'date' | 'bool' | 'boolean' | 'array'
> & {
  array: CustomArraySchemaConstructor;
  boolean: CustomBooleanSchemaConstructor;
  bool: CustomBooleanSchemaConstructor;
  string: CustomStringSchemaConstructor;
  mixed: CustomMixedSchemaConstructor;
  number: CustomNumberSchemaConstructor;
  date: CustomDateSchemaConstructor;
  bigNumber: () => CustomBigNumberSchema;
};

const yupValidator: ExtendedYupType = {
  ...Yup,
  bool: Yup.bool as CustomBooleanSchemaConstructor,
  boolean: Yup.boolean as CustomBooleanSchemaConstructor,
  array: Yup.array as CustomArraySchemaConstructor,
  string: Yup.string as CustomStringSchemaConstructor,
  mixed: Yup.mixed as CustomMixedSchemaConstructor,
  number: Yup.number as CustomNumberSchemaConstructor,
  date: Yup.date as CustomDateSchemaConstructor,
  bigNumber: () => new BigNumberSchema() as CustomBigNumberSchema,
};

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

const validator = yupValidator;

export { validator };
