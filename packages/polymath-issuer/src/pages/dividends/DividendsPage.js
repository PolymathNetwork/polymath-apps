// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Page,
  Grid,
  Heading,
  FormItem,
  LabeledItem,
  Tooltip,
  Paragraph,
  Countdown,
  Remark,
  NotFoundPage,
} from '@polymathnetwork/ui';
import type { SecurityToken } from '@polymathnetwork/js/types';
import type { RootState } from '../../redux/reducer';

type StateProps = {|
  account: ?string,
  token: ?SecurityToken,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.network.account,
  token: state.token.token,
});

type Props = {||} & StateProps;

class DividendsPage extends Component<Props, State> {
  // eslint-disable-next-line complexity
  render() {
    const { token } = this.props;
    if (!token) {
      return <NotFoundPage />;
    }
    return (
      <Page title="Dividends – Polymath">
        <Heading variant="h1" as="h1">
          Dividends
        </Heading>
        <Grid.Row>
          <Grid.Col gridSpan={[12, 12, 7]}>
            <Heading variant="h4">
              Enable the Dividends module to distribute dividends to all token
              holders. Distribution events can be added, modified, enabled or
              disabled at any time. To distribute dividends to all your token
              holders, start by creating a dividend checkpoint. A dividend
              checkpoint will report the percentage ownership of security tokens
              per wallet address. This percentage will be used to calculate the
              amount of dividends owed to each wallet address.
            </Heading>
          </Grid.Col>
          <Grid.Col gridSpan={[12, 12, 5]} />
        </Grid.Row>
      </Page>
    );
  }
}

export default connect(mapStateToProps)(DividendsPage);
