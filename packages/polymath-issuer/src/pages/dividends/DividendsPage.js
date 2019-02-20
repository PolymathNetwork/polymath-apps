import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { SecurityTokensDividendsPage } from '@polymathnetwork/new-issuer/pages';
import { Page } from '@polymathnetwork/ui';
import { ThemeProvider, GlobalStyles } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id } = props.match.params;
  const securityTokenSymbol = id.toUpperCase();

  return (
    <Fragment>
      <GlobalStyles />
      <ThemeProvider>
        <Page title="Dividends Distributions">
          <SecurityTokensDividendsPage
            securityTokenSymbol={securityTokenSymbol}
          />
        </Page>
      </ThemeProvider>
    </Fragment>
  );
};

export default connect()(AdapterContainer);
