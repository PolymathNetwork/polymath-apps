export const csvEthAddressKey = 'Investor ETH Address';
export const csvTaxWithholdingKey = '% Tax Withholding';

export enum TaxWithholdingStatuses {
  New = 'New',
  Updated = 'Updated',
}

export interface TaxWithholdingsItem {
  ['Investor ETH Address']: string;
  ['% Tax Withholding']: number;
  status?: TaxWithholdingStatuses;
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
