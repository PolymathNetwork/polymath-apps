import { connect } from 'react-redux';
import React, { Component, Fragment, Dispatch } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { polyClient } from '~/lib/polymath';
import { ModalTransactionQueue } from '~/components';
import {
  ThemeProvider,
  GlobalStyles,
  Button,
  Loading,
} from '@polymathnetwork/new-ui';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';

interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof enableErc20DividendsModuleStart>>;
}

type Props = DispatchProps;

class ContainerBase extends Component<Props> {
  public state = {
    ready: false,
  };
  public async componentDidMount() {
    const { dispatch } = this.props;
    await browserUtils.getCurrentAddress();
    await polyClient.connect();

    this.setState({ ready: true });
    console.log('Logged in.');

    // const transactionQueue = await polyClient.reserveSecurityToken({
    //   name: 'FOOKEN',
    //   symbol: 'FOOKEN',
    // });

    // console.log('transactionQueue', transactionQueue);

    // transactionQueue.onStatusChange(({ status }) => {
    //   console.debug('Status updated for transactionQueue:', status);
    // });

    // transactionQueue.onTransactionStatusChange(({ status, tag }, seq) => {
    //   console.debug(`Transaction[${tag}]: Status update => ${status}`);
    // });

    // try {
    //   await transactionQueue.run();
    // } catch (err) {
    //   console.debug('Error', err.code);
    // }
  }

  public startEnableDividends = () => {
    this.props.dispatch(
      enableErc20DividendsModuleStart({
        securityTokenSymbol: 'DIVTEST2',
        storageWalletAddress: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
      })
    );
  };

  public render() {
    return (
      <div>
        <ThemeProvider>
          <Fragment>
            <GlobalStyles />
            <ModalTransactionQueue />
            {this.state.ready ? (
              <Button onClick={this.startEnableDividends}>
                Enable Dividends (Test)
              </Button>
            ) : (
              <Loading />
            )}
          </Fragment>
        </ThemeProvider>
      </div>
    );
  }
}

const Container = connect()(ContainerBase);

export const HomePage = () => (
  <div>
    <Container />
  </div>
);
