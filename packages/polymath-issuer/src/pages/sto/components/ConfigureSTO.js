// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'carbon-components-react';
import { Grid, Page, NotFoundPage } from '@polymathnetwork/ui';
import { goBack } from '../../../actions/sto';
import ConfigureSTOForm from './ConfigureSTOForm';
import STOTemplate from './STOTemplate';

import type { Dispatch } from 'redux';
import type { STOModule, SecurityToken } from '../../../constants';
import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  token?: SecurityToken,
  stoModule?: STOModule,
  dispatch: Dispatch<any>,
|};
type OwnProps = {||};
type Props = OwnProps & StateProps;

const mapStateToProps = ({
  token: { token },
  sto: { factory },
}: RootState) => ({
  token,
  stoModule: factory,
});

type ComponentProps = {|
  token: SecurityToken,
  stoModule: STOModule,
  goBack: () => void,
|};

export const ConfigureSTOComponent = ({
  stoModule,
  token,
  goBack,
}: ComponentProps) => (
  <Page title={`Configure ${token.ticker} STO – Polymath`}>
    <Button
      kind="ghost"
      onClick={goBack}
      className="pui-go-back"
      icon="arrow--left"
    >
      Go back
    </Button>
    <h1 className="pui-h1">Security Token Offering Configuration</h1>
    <br />
    <Grid gridTemplateColumns={['', '', '', '1.5fr minmax(400px, 1fr)']}>
      <div className="pui-page-box">
        <h2 className="pui-h2">{stoModule.title}</h2>
        <h4 className="pui-h4" style={{ marginBottom: '15px' }}>
          Provide the financial details and timing for your offering below.
        </h4>
        <ConfigureSTOForm stoModule={stoModule} />
      </div>
      <Grid.Item>
        <STOTemplate stoModule={stoModule} />
      </Grid.Item>
    </Grid>
  </Page>
);

class ConfigureSTOContainer extends Component<Props> {
  goBack = () => {
    this.props.dispatch(goBack());
  };
  render() {
    const { token, stoModule } = this.props;

    if (!token || !token.address || !stoModule) {
      return <NotFoundPage />;
    }

    return (
      <ConfigureSTOComponent
        token={token}
        goBack={this.goBack}
        stoModule={stoModule}
      />
    );
  }
}

export default connect(mapStateToProps)(ConfigureSTOContainer);
