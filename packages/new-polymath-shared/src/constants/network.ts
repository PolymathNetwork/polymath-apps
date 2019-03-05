export enum NetworkIds {
  Local = 15,
  LocalVm = 16,
  Kovan = 42,
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
}

export const EtherscanSubdomains: {
  [key: number]: string;
} = {
  [NetworkIds.Kovan]: 'kovan',
  [NetworkIds.Ropsten]: 'ropsten',
  [NetworkIds.Mainnet]: '',
  [NetworkIds.Local]: 'localhost',
  [NetworkIds.LocalVm]: 'localhost',
};
