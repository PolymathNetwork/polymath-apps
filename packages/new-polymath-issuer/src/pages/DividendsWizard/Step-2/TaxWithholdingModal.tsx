import React, { FC } from 'react';
import { types } from '@polymathnetwork/new-shared';
import { TaxWithholdingsItem } from '~/pages/DividendsWizard/Step-2/shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taxWithholdings: TaxWithholdingsItem[];
}

export const TaxWithholdingModal: FC<Props> = ({ taxWithholdings }) => (
  <div>works</div>
);
