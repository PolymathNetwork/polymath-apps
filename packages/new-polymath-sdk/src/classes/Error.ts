import { ErrorCodes } from '~/types';

export const ErrorMessagesPerCode: {
  [errorCode: number]: string;
} = {
  [ErrorCodes.IncompatibleBrowser]:
    'You are using a browser that is not compatible with Ethereum',
};

export class PolymathError extends Error {
  public code: ErrorCodes;
  constructor({ message, code }: { message?: string; code: ErrorCodes }) {
    super(message || ErrorMessagesPerCode[code]);
    // tslint:disable-next-line
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, PolymathError);

    this.code = code;
  }
}
