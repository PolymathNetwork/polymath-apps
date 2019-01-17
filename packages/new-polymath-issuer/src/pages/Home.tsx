import { connect } from 'react-redux';
import React, { Component, Dispatch } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { Page, Button, Loading } from '@polymathnetwork/new-ui';
import { polyClient } from '~/lib/polymath';
import { ModalTransactionQueue } from '~/components';
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
      enableErc20DividendsModuleStart({ securityTokenSymbol: 'DIVTEST2' })
    );
  };

  public render() {
    return (
      <Page title="Home">
        <ModalTransactionQueue />
        {this.state.ready ? (
          <Button onClick={this.startEnableDividends}>
            Enable Dividends (Test)
          </Button>
        ) : (
          <Loading />
        )}
      </Page>
    );
  }
}

export const HomePage = connect()(ContainerBase);
