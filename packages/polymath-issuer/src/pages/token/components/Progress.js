// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ProgressIndicator, PageWrap, Box } from '@polymathnetwork/ui';
import type { SecurityToken } from '@polymathnetwork/js/types';

import { isProvidersPassed } from '../../providers/data';
import type { RootState } from '../../../redux/reducer';
import type { ServiceProvider } from '../../providers/data';

type StateProps = {|
  token: ?SecurityToken,
  sto: ?Object,
  providers: ?Array<ServiceProvider>,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  providers: state.providers.data,
  token: state.token.token,
  sto: state.sto.contract,
});

type Props = {||} & StateProps;

class Progress extends Component<Props> {
  render() {
    const { token, sto, providers } = this.props;

    let index = 0;
    if (sto) {
      index = 4;
    } else if (token && token.contract) {
      index = 3;
    } else if (isProvidersPassed(providers)) {
      index = 2;
    } else if (token) {
      index = 1;
    }
    return (
      <PageWrap>
        <Box mb="xl">
          <ProgressIndicator currentIndex={index}>
            <ProgressIndicator.Step label="Reserve Token Symbol" />
            <ProgressIndicator.Step label="Choose Your Providers" />
            <ProgressIndicator.Step label="Create Token" />
            <ProgressIndicator.Step label="Set Up Offering Details" />
            <ProgressIndicator.Step label="Whitelist Investors" />
          </ProgressIndicator>
        </Box>
      </PageWrap>
    );
  }
}

export default connect(mapStateToProps)(Progress);
