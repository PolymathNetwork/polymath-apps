import React from 'react';
import { withRouter } from 'react-router';
import * as pages from '@polymathnetwork/new-issuer/pages';

const DividendsPageAdapter = ({ match }) => {
  const securityTokenSymbol = match.params.id.toUpperCase();
  return (
    <pages.SecurityTokensDividendsPage
      securityTokenSymbol={securityTokenSymbol}
    />
  );
};

export default withRouter(DividendsPageAdapter);
