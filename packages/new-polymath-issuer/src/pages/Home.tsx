import { polyClient } from '~/lib/polymath';
import React, { Component, Fragment, Dispatch } from 'react';
import { browserUtils } from '@polymathnetwork/sdk';
import { ModalTransactionQueue } from '~/components';
import { connect } from 'react-redux';
import { ThemeProvider, GlobalStyles, theme } from '@polymathnetwork/new-ui';
import { enableErc20DividendsModuleStart } from '~/state/actions/procedures';
import { ActionType } from 'typesafe-actions';

interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof enableErc20DividendsModuleStart>>;
}

type Props = DispatchProps;

class ContainerBase extends Component<Props> {
  public async componentDidMount() {
    const { dispatch } = this.props;
    await browserUtils.getCurrentAddress();
    await polyClient.connect();

    dispatch(enableErc20DividendsModuleStart({ securityTokenSymbol: 'A0T0' }));

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

  public render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <Fragment>
            <GlobalStyles />
            <ModalTransactionQueue />
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
