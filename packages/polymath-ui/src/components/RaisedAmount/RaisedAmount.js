import React from 'react';
import { thousandsDelimiter } from '../../helpers';

import './style.scss';

const RaisedAmount = ({
  title,
  primaryAmount,
  primaryUnit,
  tokenAmount,
  tokenUnit,
}) => (
  <div className="pui-key-value pui-amount-raised">
    <div>{title}</div>
    <div className="primary-amount">{`${thousandsDelimiter(
      primaryAmount
    )} ${primaryUnit}`}</div>
    <div className="token-amount">{`${thousandsDelimiter(
      tokenAmount
    )} ${tokenUnit}`}</div>
  </div>
);

export default RaisedAmount;
