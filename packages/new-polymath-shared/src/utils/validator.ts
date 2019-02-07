import Web3 from 'web3';

export class Validator {
  private readonly web3: Web3 = new Web3();

  public validate = (value: any, rules: Array<string>) => {
    const self: any = this;
    return rules.every(rule => {
      return self[rule](value);
    });
  };

  private isString = (value: any) => {
    if (typeof value === 'string') {
      return true;
    }
    return false;
  };

  private isNotEmpty = (value: any) => {
    if (value !== '' && value !== null && typeof value !== 'undefined') {
      return true;
    }
    return false;
  };

  private isInt = (value: any) => {
    return Number.isInteger(value);
  };

  private isAddress = (value: any) => {
    return this.web3.utils.isAddress(value);
  };

  private isDate = (value: any) => {
    return new Date(value).toString() !== 'Invalid Date';
  };
}

export const createValidator = () => {
  return new Validator();
};
