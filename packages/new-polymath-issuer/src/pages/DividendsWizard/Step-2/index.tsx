import React, { FC } from 'react';

interface Props {
  onNextStep: () => void;
}

/**
 * 1. There is ONE taxWithholdings list that we manage
 * 2. This list is values.taxWithholdings list
 */

export const Step2: FC<Props> = ({ onNextStep }) => (
  <div>
    Feature in construction,{' '}
    <button onClick={onNextStep}>proceed for now</button>
  </div>
);
