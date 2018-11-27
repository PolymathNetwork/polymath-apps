// @flow

import React from 'react';
import { SecurityTokenRegistry, PolyToken } from '@polymathnetwork/js';
import * as ui from '@polymathnetwork/ui';
import type { SymbolDetails } from '@polymathnetwork/js/types';

import type { GetState } from '../../redux/reducer';

export const EXPIRY_LIMIT = 'ticker/EXPIRY_LIMIT';
export const expiryLimit = () => async (dispatch: Function) =>
  dispatch({
    type: EXPIRY_LIMIT,
    value: await SecurityTokenRegistry.expiryLimitInDays(),
  });

export const RESERVED = 'ticker/RESERVED';

export const TOKENS = 'ticker/TOKENS';

export const getMyTokens = () => async (dispatch: Function) => {
  const tokens = await SecurityTokenRegistry.getMyTokens();
  dispatch({ type: TOKENS, tokens });
  if (tokens.length) {
    dispatch({ type: RESERVED });
  }
};

export const reserve = (details: Object) => async (
  dispatch: Function,
  getState: GetState
) => {
  const { isEmailConfirmed } = getState().pui.account;
  const fee = await SecurityTokenRegistry.registrationFee();
  const feeView = ui.thousandsDelimiter(fee); // $FlowFixMe
  dispatch(
    ui.confirm(
      <div>
        <p>
          Completion of your token symbol reservation will require two wallet
          transactions.
        </p>
        <p>
          • The first transaction will be used to pay for the token symbol
          reservation cost of:
        </p>
        <div className="bx--details poly-cost">{feeView} POLY</div>
        <p>
          • The second transaction will be used to pay the mining fee (aka gas
          fee) to complete the reservation of your token symbol.
          <br />
        </p>
        <p>
          Please hit &laquo;CONFIRM&raquo; when you are ready to proceed. Once
          you hit &laquo;CONFIRM&raquo;, your Token Symbol reservation will be
          sent to the blockchain and will be immutable unless it expires. Any
          change prior to your reservation expiry will require that you start
          the process over using another token symbol.
          <br /> If you do not wish to pay the token symbol reservation fee or
          wish to review your information, simply select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      async () => {
        if (getState().pui.account.balance.lt(fee)) {
          dispatch(
            ui.faucet(
              `The reservation of a token symbol has a fixed cost of ${feeView} POLY.`
            )
          );
          return;
        }

        const allowance = await PolyToken.allowance(
          SecurityTokenRegistry.account,
          SecurityTokenRegistry.address
        );
        //Skip approve transaction if transfer is already allowed
        let title = ['Reserving Token Symbol'];
        if (allowance == 0) {
          title.unshift('Approving POLY Spend');
        }

        dispatch(
          ui.tx(
            title,
            async () => {
              await SecurityTokenRegistry.registerTicker(details);
              if (isEmailConfirmed) {
                dispatch(tickerReservationEmail());
              }
            },
            `Your Token Symbol ${details.ticker} Was Reserved Successfully`,
            () => {
              dispatch({ type: RESERVED });
            },
            undefined,
            `/dashboard/${details.ticker}/providers`,
            undefined,
            !isEmailConfirmed,
            details.ticker.toUpperCase() + ' Token Symbol Reservation'
          )
        );
      },
      `Before you Proceed with Your ${details.ticker.toUpperCase()} Token Symbol Reservation`,
      undefined,
      'pui-large-confirm-modal'
    )
  );
};

export const confirmEmail = (email: string) => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.requestConfirmEmail(email));
};

// FIXME @RafaelVidaurre: Can we remove this? It doesn't seem to do anything now
export const tickerReservationEmail = () => async (
  dispatch: Function,
  getState: GetState
) => {
  try {
    const tokens = await SecurityTokenRegistry.getMyTokens();
    const token: SymbolDetails = tokens.pop();
  } catch (e) {
    // eslint-disable-next-line
    console.error('tickerReservationEmail', e);
  }
};
