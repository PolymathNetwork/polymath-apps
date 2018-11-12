import React from 'react';
import Contract, {
  SecurityTokenRegistry,
  PolyToken,
} from '@polymathnetwork/js';
import * as ui from '@polymathnetwork/ui';
import LegacySTRArtifact from '../utils/legacy-artifacts/LegacySecurityTokenRegistry.json';
import LegacySTArtifact from '../utils/legacy-artifacts/LegacySecurityToken.json';
import type { SymbolDetails } from '@polymathnetwork/js/types';
import axios from 'axios';

// TODO @grsmto: Form values shouldn't be retrieved this way...fault of Redux-form
// for encouraging bad pattern. This should be passed as props instead.
import { formName } from '../pages/ticker/components/TickerForm';
import type { GetState } from '../../redux/reducer';

export const EXPIRY_LIMIT = 'ticker/EXPIRY_LIMIT';
export const expiryLimit = () => async (dispatch: Function) =>
  dispatch({
    type: EXPIRY_LIMIT,
    value: await SecurityTokenRegistry.expiryLimitInDays(),
  });

export const RESERVED = 'ticker/RESERVED';

export const TOKENS = 'ticker/TOKENS';

export const LEGACY_TOKENS = 'ticker/LEGACY_TOKENS';

export const FETCHING_TOKENS = 'ticker/FETCHING_TOKENS';

export const getMyTokens = () => async (dispatch: Function) => {
  const tokens = await SecurityTokenRegistry.getMyTokens();
  dispatch({ type: TOKENS, tokens });
  if (tokens.length) {
    dispatch({ type: RESERVED });
  }
};

export const getLegacyTokens = () => async (dispatch: Function) => {
  dispatch({ type: FETCHING_TOKENS });
  const { web3WS, account } = Contract._params;
  const networkId = await web3WS.eth.net.getId();

  // Fetch only on mainnet
  if (networkId !== 42) {
    dispatch(ui.fetched());
    return;
  }

  // Fetch the tokens using the etherscan API
  const logs = await axios.get('https://api-kovan.etherscan.io/api', {
    params: {
      module: 'logs',
      action: 'getLogs',
      fromBlock: 0,
      toBlock: 'latest',
      address: LegacySTRArtifact.networks[networkId].address,
      topic0: web3WS.utils.sha3('LogNewSecurityToken(string,address,address)'),
      topic0_2_opr: 'and',
      topic2: web3WS.eth.abi.encodeParameter('address', account),
      apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
    },
  });

  // Decode the logs using the ABI
  const inputs = LegacySTRArtifact.abi.find(
    o => o.name === 'LogNewSecurityToken' && o.type === 'event'
  ).inputs;

  const ownedTokens = [];

  for (const legacyToken of logs.data.result) {
    const data = web3WS.eth.abi.decodeLog(
      inputs,
      legacyToken.data,
      legacyToken.topics.slice(1)
    );

    const { _ticker: ticker, _securityTokenAddress: address } = data;

    const legacyTokenContract = new web3WS.eth.Contract(
      LegacySTArtifact.abi,
      address
    );

    const currentOwner = await legacyTokenContract.methods.owner().call();

    if (currentOwner === account) {
      ownedTokens.push({
        ticker,
        address,
      });
    }
  }

  dispatch({ type: LEGACY_TOKENS, legacyTokens: ownedTokens });
};

export const reserve = () => async (dispatch: Function, getState: GetState) => {
  const { isEmailConfirmed } = getState().pui.account;
  const fee = await SecurityTokenRegistry.registrationFee();
  const feeView = ui.thousandsDelimiter(fee); // $FlowFixMe
  const details: SymbolDetails = getState().form[formName].values;
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

export const confirmEmail = (data: Object) => async (
  dispatch: Function,
  getState: GetState
) => {
  const { email } = data;
  dispatch(ui.requestConfirmEmail(email));
};

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
