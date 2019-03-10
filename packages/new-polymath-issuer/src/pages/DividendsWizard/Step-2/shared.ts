export const csvEthAddressKey = 'Investor ETH Address';
export const csvTaxWithholdingKey = '% Tax Withholding';

export interface TaxWithholdingsItem {
  ['Investor ETH Address']: string;
  ['% Tax Withholding']: number | null;
}
