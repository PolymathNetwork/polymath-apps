export const csvEthAddressKey = 'Investor ETH Address';
export const csvTaxWithholdingKey = '% Tax Withholding';

export interface TaxWithholdingsItem {
  ['Investor ETH Address']: string;
  ['% Tax Withholding']: number;
}

export interface PartialTaxWithholdingsItem {
  ['Investor ETH Address']?: string;
  ['% Tax Withholding']: number | null;
}

export interface FormValues {
  taxWithholdings: TaxWithholdingsItem[];
  currentTaxWithholding: PartialTaxWithholdingsItem;
  isTaxWithholdingConfirmed: boolean;
}
