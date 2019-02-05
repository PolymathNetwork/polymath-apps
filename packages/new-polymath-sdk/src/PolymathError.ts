import { ErrorCodes } from '~/types';

export const ErrorMessagesPerCode: {
  [errorCode: string]: string;
} = {
  [ErrorCodes.IncompatibleBrowser]:
    'The browser bring used is not compatible with Ethereum',
  [ErrorCodes.WalletIsLocked]:
    'The wallet is locked, if Metamask extension is being used, the user needs to unlock it first',
  [ErrorCodes.UserDeniedAccess]: 'The user denied access',
  [ErrorCodes.TransactionRejectedByUser]: 'The user rejected the transaction',
};

export class PolymathError extends Error {
  public code: ErrorCodes;
  constructor({ message, code }: { message?: string; code: ErrorCodes }) {
    super(
      message || ErrorMessagesPerCode[code] || 'Unknown error, code: ' + code
    );
    // tslint:disable-next-line
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Object.setPrototypeOf(this, PolymathError);

    this.code = code;
  }
}
