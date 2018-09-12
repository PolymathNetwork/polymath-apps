// @flow

import React from 'react';
import BigNumber from 'bignumber.js';
import sigUtil from 'eth-sig-util';
import { PolyToken } from '@polymathnetwork/js';
import type { Address } from '@polymathnetwork/js/types';
import type { Node } from 'react';

import Remark from '../../components/Remark';
import { fetching, fetchingFailed, fetched, notify } from '../..';
import { formName as signUpFormName } from './SignUpForm';
import * as offchain from '../../offchain';
import { tx } from '../tx/actions';
import { confirm } from '../modal/actions';
import { thousandsDelimiter } from '../../helpers';
import type { ExtractReturn } from '../../redux/helpers';
import type { GetState } from '../../redux/reducer';

export const SIGN_IN_START = '@polymathnetwork/uiaccount/SIGN_IN_START';
export const signInStart = () => ({ type: SIGN_IN_START });

export const SIGN_IN_CANCEL = '@polymathnetwork/uiaccount/SIGN_IN_CANCEL';
export const signInCancel = () => ({ type: SIGN_IN_CANCEL });

export const SIGNED_IN = '@polymathnetwork/uiaccount/SIGNED_IN';
export const signedIn = () => ({ type: SIGNED_IN });

export const SIGNED_UP = '@polymathnetwork/uiaccount/SIGNED_UP';
export const signedUp = (
  name: string,
  email: string,
  isEmailConfirmed: boolean = true
) => ({ type: SIGNED_UP, name, email, isEmailConfirmed });

export const REQUEST_CONFIRM_EMAIL =
  '@polymathnetwork/uiaccount/REQUEST_CONFIRM_EMAIL';
export const ENTER_PIN_DEFAULT = '@polymathnetwork/uiaccount/ENTER_PIN_DEFAULT';
export const ENTER_PIN_SUCCESS = '@polymathnetwork/uiaccount/ENTER_PIN_SUCCESS';
export const ENTER_PIN_ERROR = '@polymathnetwork/uiaccount/ENTER_PIN_ERROR';
export const CANCEL_CONFIRM_EMAIL =
  '@polymathnetwork/uiaccount/CANCEL_CONFIRM_EMAIL';
export const cancelConfirmEmail = () => ({ type: CANCEL_CONFIRM_EMAIL });

export const EMAIL_CONFIRMED = '@polymathnetwork/uiaccount/EMAIL_CONFIRMED';
export const emailConfirmed = () => ({ type: EMAIL_CONFIRMED });

export const BALANCE = '@polymathnetwork/uiaccount/BALANCE';
export const setBalance = (balance: BigNumber) => ({ type: BALANCE, balance });

export type Action =
  | ExtractReturn<typeof signedIn>
  | ExtractReturn<typeof signedUp>
  | ExtractReturn<typeof setBalance>;

export type AccountInnerData = {|
  name: string,
  email: string,
|};

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

  let authCode, authName;
  try {
    [authCode, authName] = await Promise.all([
      offchain.getAuthCode(account),
      offchain.getAuthName(),
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
      authCode,
      [{ type: 'string', name: authName, value: authCode }],
      account
    );
  } catch (e) {
    dispatch(signInCancel());
    return;
  }

  dispatch(fetching());
  try {
    const user = await offchain.auth(authCode, sig, account);

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
  if (!web3.currentProvider.sendAsync) {
    return web3.eth.sign(normal, address);
  }

  const result = await new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        method: 'eth_signTypedData',
        params: [typed, address],
        from: address,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });

  if (result.error) {
    throw result.error;
  }

  const recovered = sigUtil.recoverTypedSignature({
    data: typed,
    sig: result.result,
  });

  if (recovered.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Failed to verify signer, got: ' + result);
  }

  return result.result;
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
  try {
    await offchain.confirmEmail(pin);
    // TODO @bshevchenko: show success screen
    if (global.FS) {
      const { email, name } = getState().pui.account;
      const { account } = getState().network;
      global.FS.identify(account, {
        ethAddress: account,
        email,
        name,
      });
    }
    dispatch({ type: ENTER_PIN_SUCCESS });
  } catch (e) {
    dispatch({ type: ENTER_PIN_ERROR });
  }
};

// eslint-disable-next-line global-require, import/no-unresolved, $FlowFixMe
// TODO @RafaelVidaurre: Hardcoding for now, this is a BIG nono
const coreVersion = '1.4.0';

// eslint-disable-next-line max-len
export const email = (txHash: string, subject: string, body: Node) => async (
  dispatch: Function,
  getState: GetState
) => {
  await offchain.email(
    txHash,
    subject,
    body,
    coreVersion,
    getState().network.id
  );
};

export const providersApply = (data: Object) => async (
  dispatch: Function,
  getState: GetState
) => {
  await offchain.providersApply(data, coreVersion, getState().network.id);
};

export const faucet = (message: string) => async (
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
  }

  const amount = 25000;
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
          &raquo; button below to receive {thousandsDelimiter(amount)} test POLY
          in your wallet.
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
            true
          )
        );
      },
      title,
      buttonLabel,
      '',
      headerLabel
    )
  );
};
