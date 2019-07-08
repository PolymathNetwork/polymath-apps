import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { DividendsWizardPage } from '@polymathnetwork/new-issuer/pages';
import { NewIssuerAdapter } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id, checkpointId } = props.match.params;
  const symbol = id.toUpperCase();

  return (
    <NewIssuerAdapter>
      <ThemeProvider>
        <DividendsWizardPage checkpointId={checkpointId} symbol={symbol} />
      </ThemeProvider>
    </NewIssuerAdapter>
  );
};

export default connect()(AdapterContainer);
