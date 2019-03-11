import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DividendDetailsPage } from '@polymathnetwork/new-issuer/pages';
import { Page, NewIssuerAdapter } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id, dividendIndex } = props.match.params;
  const securityTokenSymbol = id.toUpperCase();

  return (
    <NewIssuerAdapter>
      <ThemeProvider>
        <DividendDetailsPage
          dividendIndex={dividendIndex}
          securityTokenSymbol={securityTokenSymbol}
        />
      </ThemeProvider>
    </NewIssuerAdapter>
  );
};

export default connect()(AdapterContainer);
