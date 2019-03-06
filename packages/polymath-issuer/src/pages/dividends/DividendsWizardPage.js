import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DividendsWizardPage } from '@polymathnetwork/new-issuer/pages';
import { Page } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id, checkpointIndex } = props.match.params;
  const securityTokenSymbol = id.toUpperCase();

  return (
    <Fragment>
      <ThemeProvider>
        <Page title="New Dividends Distribution">
          <DividendsWizardPage
            checkpointIndex={checkpointIndex}
            securityTokenSymbol={securityTokenSymbol}
          />
        </Page>
      </ThemeProvider>
    </Fragment>
  );
};

export default connect()(AdapterContainer);
