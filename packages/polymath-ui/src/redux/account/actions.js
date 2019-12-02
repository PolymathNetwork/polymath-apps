// @flow

import React from 'react';
import BigNumber from 'bignumber.js';
import sigUtil from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { PolyToken } from '@polymathnetwork/js';
// TODO @grsmto: This file shouldn't contain any React components as this is just triggering Redux actions. Consider moving them as separated component files.
import {
  Remark,
  fetching,
  fetchingFailed,
  fetched,
  notify,
  tx,
  confirm,
} from '../../';
import * as offchain from '../../offchain';
import { thousandsDelimiter } from '../../helpers';
// TODO @grsmto: We shouldn't dig into view components to retrieve that
// that should be passed as arguments to the action instead
import { formName as signUpFormName } from '../../components/SignUpPage/SignUpForm';

import type { Address } from '@polymathnetwork/js/types';

import type { ExtractReturn } from '../helpers';
import type { GetState } from '../reducer';

export const SIGN_IN_START = 'polymath/account/SIGN_IN_START';
export const signInStart = () => ({ type: SIGN_IN_START });

export const SIGN_IN_CANCEL = 'polymath/account/SIGN_IN_CANCEL';
export const signInCancel = () => ({ type: SIGN_IN_CANCEL });

export const SIGNED_IN = 'polymath/account/SIGNED_IN';
export const signedIn = () => ({ type: SIGNED_IN });

export const SIGNED_UP = 'polymath/account/SIGNED_UP';
export const signedUp = (
  name: string,
  email: string,
  isEmailConfirmed: boolean = true
) => ({ type: SIGNED_UP, name, email, isEmailConfirmed });

export const REQUEST_CONFIRM_EMAIL = 'polymath/account/REQUEST_CONFIRM_EMAIL';
export const ENTER_PIN_DEFAULT = 'polymath/account/ENTER_PIN_DEFAULT';
export const ENTER_PIN_SUCCESS = 'polymath/account/ENTER_PIN_SUCCESS';
export const ENTER_PIN_ERROR = 'polymath/account/ENTER_PIN_ERROR';
export const CANCEL_CONFIRM_EMAIL = 'polymath/account/CANCEL_CONFIRM_EMAIL';
export const cancelConfirmEmail = () => ({ type: CANCEL_CONFIRM_EMAIL });

export const EMAIL_CONFIRMED = 'polymath/account/EMAIL_CONFIRMED';
export const emailConfirmed = () => ({ type: EMAIL_CONFIRMED });

export const BALANCE = 'polymath/account/BALANCE';
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance });

export type Action =
  | ExtractReturn<typeof signedIn>
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>;

export type AccountInnerData = {|
  name: string,
  email: string,
|};

// NOTE @RafaelVidaurre: Leaving this here as reference of what was being used
// before rolling back to personalSign to support hardwar wallets
const signTypedData = ({ web3, normal, typed, address }) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData',
        params: [typed, address],
        from: address,
      },
      (err, response) => {
        const error = err || response.error;

        if (error) {
          reject(error);
          return;
        }

        // NOTE: Not sure why we need to verify this in the client, confirm we need this
        const recovered = sigUtil.recoverTypedSignature({
          data: typed,
          sig: response.result,
        });
        if (recovered.toLowerCase() !== address.toLowerCase()) {
          throw new Error('Failed to verify signer, got: ' + response);
        }

        return response;
      }
    );
  });
};

const signPersonal = ({ web3, normal, address }) => {
  const message = bufferToHex(new Buffer(normal, 'utf8'));

  return new Promise((resolve, reject) => {
    if (!web3.currentProvider.sendAsync) {
      web3.eth.sign(normal, address, (err, result) => {
        if (err) {
          console.log('err', err);
          reject(err);
        }

        resolve({ result });
      });
      return;
    }

    web3.currentProvider.sendAsync(
      {
        method: 'personal_sign',
        params: [message, address],
        from: address,
      },
      (err, response) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      }
    );
  });
};

export const fetchBalance = () => async (dispatch: Function) => {
  const balance = await PolyToken.myBalance();
  await PolyToken.subscribeMyTransfers(
    async (toOrFrom: Address, value: BigNumber, isFrom: boolean) => {
      dispatch(setBalance(await PolyToken.myBalance()));
      dispatch(
        notify(
          `${isFrom ? 'Sent' : 'Received'} ${thousandsDelimiter(value)} POLY`
        ),
        true
      );
    }
  );
  dispatch(setBalance(balance));
};

export const signIn = () => async (dispatch: Function, getState: GetState) => {
  if (getState().pui.account.isSignedIn) {
    return;
  }

  dispatch(fetching());
  dispatch(signInStart());

  const { web3, account } = getState().network;

  if (global.FS) {
    global.FS.identify(account, {
      ethAddress: account,
    });
  }

  let code, typedName;
  try {
    [{ code, typedName }] = await Promise.all([
      offchain.getAuthCode(account),
      dispatch(fetchBalance()),
    ]);
  } catch (e) {
    dispatch(fetchingFailed(e));
    return;
  }

  dispatch(fetched());
  let sig;

  try {
    sig = await signData(
      web3,
      code,
      [{ type: 'string', name: typedName, value: code }],
      account
    );
  } catch (e) {
    dispatch(signInCancel());
    return;
  }

  dispatch(fetching());

  try {
    const user = await offchain.auth(code, sig, account);

    if (global.FS) {
      global.FS.identify(account, {
        ethAddress: account,
        ...(user || {}),
      });
    }

    dispatch(signedIn());

    if (user) {
      dispatch(signedUp(user.name, user.email, true));
    }

    dispatch(fetched());
  } catch (e) {
    dispatch(fetchingFailed(e));
  }
};

const signData = async (web3, normal, typed, address) => {
  let response;

  try {
    // TODO @RafaelVidaurre: Move to SignTypedData in new dApp if we can detect
    // if web3 provider uses a hardware wallet
    response = await signPersonal({ web3, normal, address });
  } catch (err) {
    throw err;
  }
  return response.result;
};

export const signUp = () => async (dispatch: Function, getState: GetState) => {
  const { name, email } = getState().form[signUpFormName].values;
  dispatch(signedUp(name, email, false));
  dispatch(fetched());
  dispatch(notify('You Were Successfully Signed Up', true));
};

export const requestConfirmEmail = (email: ?string) => async (
  dispatch: Function,
  getState: GetState
) => {
  const { name } = getState().pui.account;
  if (!email) {
    // eslint-disable-next-line no-param-reassign
    email = getState().pui.account.email;
  } else {
    // $FlowFixMe
    dispatch(signedUp(name, email, false));
  }
  dispatch(fetching());
  try {
    await offchain.newEmail(email, name);
    dispatch({ type: REQUEST_CONFIRM_EMAIL });
    dispatch(fetched());
  } catch (e) {
    dispatch(fetchingFailed(e));
  }
};

export const confirmEmail = (pin: string) => async (
  dispatch: Function,
  getState: GetState
) => {
  // TODO @bshevchenko: fires two times for some reason, one time with string and another time with object
  if (typeof pin !== 'string') {
    return;
  }
  if (!pin) {
    dispatch({ type: ENTER_PIN_DEFAULT });
    return;
  }

  let confirmed;

  try {
    confirmed = !!(await offchain.confirmEmail(pin));
  } catch (err) {
    confirmed = false;
  }

  if (global.FS) {
    const { email, name } = getState().pui.account;
    const { account } = getState().network;

    global.FS.identify(account, {
      ethAddress: account,
      email,
      name,
    });
  }

  if (confirmed) {
    return dispatch({ type: ENTER_PIN_SUCCESS });
  } else {
    throw dispatch({ type: ENTER_PIN_ERROR });
  }
};

// eslint-disable-next-line global-require, import/no-unresolved, $FlowFixMe

export const providersApply = (data: Object) => async (
  dispatch: Function,
  getState: GetState
) => {
  await offchain.providersApply(data, getState().network.id.toString());
};

export const faucet = (message: string, amount?: number = 100500) => async (
  dispatch: Function,
  getState: GetState
) => {
  const intro = (
    <p>
      {message}
      &nbsp; Please make sure that your wallet has a sufficient balance in POLY
      to complete this operation.
    </p>
  );
  const title = 'Insufficient POLY Balance';
  const headerLabel = 'Transaction Impossible';

  if (Number(getState().network.id) === 1) {
    dispatch(
      confirm(
        <div>
          {intro}
          <p>
            If you need to obtain POLY tokens, you can visit&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://shapeshift.io"
            >
              this
            </a>{' '}
            or obtain more information&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://etherscan.io/token/0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec#tokenExchange"
            >
              here
            </a>
            .
          </p>
        </div>,
        () => {},
        title,
        'Understood',
        '',
        headerLabel
      )
    );
    return;
  } else if (Number(getState().network.id) === 42) {
    const buttonLabel = `REQUEST ${amount / 1000}K POLY`;
    dispatch(
      confirm(
        <div>
          {intro}
          <p>
            You are currently connected to the{' '}
            <span style={{ fontWeight: 'bold' }}>Kovan Test Network</span>.
          </p>
          <p>
            As such, you can click on the &laquo;
            {buttonLabel}
            &raquo; button below to receive {thousandsDelimiter(amount)} test
            POLY in your wallet.
          </p>
          <p>
            To receive your Kovan Testnet POLY, you’ll need a supply of KETH
            (Kovan Testnet ETH) to pay for gas fees. To receive your KETH,{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/kovan-testnet/faucet#kovan-faucet"
            >
              click here
            </a>{' '}
            and follow the steps to receive your KETH.
          </p>
          <br />
          <Remark title="Note">
            This option is not available on the Mainnet.
          </Remark>
        </div>,
        () => {
          const { account } = getState().network;
          dispatch(
            tx(
              ['Receiving POLY From Faucet'],
              async () => {
                await PolyToken.getTokens(amount, account);
              },
              'You have successfully received ' +
                thousandsDelimiter(amount) +
                ' POLY',
              undefined,
              undefined,
              undefined,
              undefined,
              true
            )
          );
        },
        title,
        buttonLabel,
        'pui-large-confirm-modal',
        headerLabel
      )
    );
  } else if (Number(getState().network.id) === 5) {
    const buttonLabel = `REQUEST ${amount / 1000}K POLY`;
    dispatch(
      confirm(
        <div>
          {intro}
          <p>
            You are currently connected to the{' '}
            <span style={{ fontWeight: 'bold' }}>Goerli Test Network</span>.
          </p>
          <p>
            As such, you can click on the &laquo;
            {buttonLabel}
            &raquo; button below to receive {thousandsDelimiter(amount)} test
            POLY in your wallet.
          </p>
          <p>
            To receive your Goerli Testnet POLY, you’ll need a supply of KETH
            (Goerli Testnet ETH) to pay for gas fees. To receive your KETH,{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/goerli/testnet"
            >
              click here
            </a>{' '}
            and follow the steps to receive your KETH.
          </p>
          <br />
          <Remark title="Note">
            This option is not available on the Mainnet.
          </Remark>
        </div>,
        () => {
          const { account } = getState().network;
          dispatch(
            tx(
              ['Receiving POLY From Faucet'],
              async () => {
                await PolyToken.getTokens(amount, account);
              },
              'You have successfully received ' +
                thousandsDelimiter(amount) +
                ' POLY',
              undefined,
              undefined,
              undefined,
              undefined,
              true
            )
          );
        },
        title,
        buttonLabel,
        'pui-large-confirm-modal',
        headerLabel
      )
    );
  }
};
