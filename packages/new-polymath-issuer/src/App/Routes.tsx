import React, { Component, FC } from 'react';
import { Router, RouteComponentProps } from '@reach/router';
import { Provider, HttpProvider } from 'web3/types';
import { Polymath } from '@polymathnetwork/polymath-sdk';
import Web3 from 'web3';

interface Ethereum extends HttpProvider {
  enable(): Promise<void>;
}

class InitializeTemp extends Component<RouteComponentProps> {
  public async componentDidMount() {
    const win = window as {
      web3?: Web3;
      ethereum?: Ethereum;
    };

    let provider: Provider;
    const isModern = !!win.ethereum;
    const isLegacy = !isModern && !!win.web3;

    if (isModern) {
      const web3Provider = win.ethereum as Ethereum;
      provider = web3Provider;
    } else if (isLegacy) {
      const web3Instance = win.web3 as Web3;
      provider = web3Instance.currentProvider;
    } else {
      throw new Error('No provider!');
    }

    const web3 = new Web3(provider);

    if (isModern) {
      const prov = provider as Ethereum;
      try {
        await prov.enable();
      } catch (err) {
        throw err;
      }
    }
    const accounts = await web3.eth.getAccounts();

    Polymath.config(web3);
  }

  public render() {
    return <div>Hi!</div>;
  }
}

export const Routes = () => (
  <Router>
    <InitializeTemp path="/" />
  </Router>
);
