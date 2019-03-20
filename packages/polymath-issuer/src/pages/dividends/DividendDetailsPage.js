import React from 'react';
import { connect } from 'react-redux';
import { DividendDetailsPage } from '@polymathnetwork/new-issuer/pages';
import { NewIssuerAdapter } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id, dividendIndex, checkpointIndex } = props.match.params;
  const securityTokenSymbol = id.toUpperCase();

  return (
    <NewIssuerAdapter>
      <ThemeProvider>
        <DividendDetailsPage
          dividendIndex={dividendIndex}
          securityTokenSymbol={securityTokenSymbol}
          checkpointIndex={checkpointIndex}
        />
      </ThemeProvider>
    </NewIssuerAdapter>
  );
};

export default connect()(AdapterContainer);
