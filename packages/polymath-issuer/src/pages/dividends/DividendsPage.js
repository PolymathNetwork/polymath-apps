import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { SecurityTokensDividendsPage } from '@polymathnetwork/new-issuer/pages';
import { Page, NewIssuerAdapter } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id } = props.match.params;
  const symbol = id.toUpperCase();

  return (
    <NewIssuerAdapter>
      <ThemeProvider>
        <SecurityTokensDividendsPage symbol={symbol} />
      </ThemeProvider>
    </NewIssuerAdapter>
  );
};

export default connect()(AdapterContainer);
