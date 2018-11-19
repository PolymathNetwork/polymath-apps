import * as Yup from 'yup';
import { BigNumberSchema } from './types/BigNumberSchema.js';

Yup.bigNumber = () => new BigNumberSchema();

Yup.addMethod(Yup.mixed, 'isRequired', function(message) {
  return this.required(message).typeError(message);
});

export default Yup;
