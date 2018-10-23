// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import { Button } from 'carbon-components-react';
import { NotFoundPage } from '@polymathnetwork/ui';
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
  <DocumentTitle title={`Configure ${token.ticker} STO – Polymath`}>
    <div>
      <div className="bx--row">
        <div className="bx--col-xs-12">
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
          <div className="bx--row">
            <div className="bx--col-xs-8">
              <div className="pui-page-box">
                <h2 className="pui-h2">{stoModule.title}</h2>
                <h4 className="pui-h4" style={{ marginBottom: '15px' }}>
                  Provide the financial details and timing for your offering
                  below.
                </h4>
                <ConfigureSTOForm stoModule={stoModule} />
              </div>
            </div>
            <div className="bx--col-xs-4">
              <STOTemplate stoModule={stoModule} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </DocumentTitle>
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
