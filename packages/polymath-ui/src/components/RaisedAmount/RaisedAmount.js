import React from 'react';

import './style.scss';

const RaisedAmount = ({ title, primaryAmount, tokenAmount }) => (
  <div className="pui-key-value pui-countdown-raised">
    <div>{title}</div>
    {primaryAmount}
    <div>{tokenAmount}</div>
  </div>
);

export default RaisedAmount;
