import React from 'react';
import { connect } from 'react-redux';
import { DividendDetailsPage } from '@polymathnetwork/new-issuer/pages';
import { NewIssuerAdapter } from '@polymathnetwork/ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';

const AdapterContainer = props => {
  const { id, dividendIndex, checkpointId } = props.match.params;
  const symbol = id.toUpperCase();

  return (
    <NewIssuerAdapter>
      <ThemeProvider>
        <DividendDetailsPage
          dividendIndex={dividendIndex}
          symbol={symbol}
          checkpointId={checkpointId}
        />
      </ThemeProvider>
    </NewIssuerAdapter>
  );
};

export default connect()(AdapterContainer);
