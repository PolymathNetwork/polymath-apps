// @flow

import React, { Component } from 'react';

import { bull } from '@polymathnetwork/ui';

export default class NotFoundPage extends Component<{}> {
  render() {
    return (
      <div className="pui-single-box">
        <div className="pui-single-box-header">
          <div className="pui-single-box-bull">
            <img src={bull} alt="Bull" />
          </div>
          <h1 className="pui-h1">Maintenance In Progress</h1>
          <h3 className="pui-h3">
            Providers page is temporarily unavailable as it undergoes
            maintenance.
          </h3>
        </div>
      </div>
    );
  }
}
