// @flow

import React from 'react';
import semver from 'semver';
import Contract, {
  PolyToken,
  SecurityTokenRegistry,
  CountTransferManager,
} from '@polymathnetwork/js';
import { MAINNET_NETWORK_ID } from '@polymathnetwork/shared/constants';
import * as ui from '@polymathnetwork/ui';
import moment from 'moment';
import axios from 'axios';
import FileSaver from 'file-saver';
import CSVFileValidator from '../utils/parsers/csv-file-validator';
import {
  validateAddress,
  validateDate,
  validateError,
  requiredError,
  uniqueError,
  headerError,
} from '../utils/parsers/common';

import LegacySTRArtifact from '../utils/legacy-artifacts/LegacySecurityTokenRegistry.json';
import LegacySTArtifact from '../utils/legacy-artifacts/LegacySecurityToken.json';

import { ethereumAddress } from '@polymathnetwork/ui/deprecated/validate';
import type {
  SecurityToken,
  Investor,
  Address,
} from '@polymathnetwork/js/types';

// TODO @grsmto: This file shouldn't contain any React components as this is just triggering Redux actions. Consider moving them as separated component files.
import { fetch as fetchSTO } from './sto';
import { PERMANENT_LOCKUP_TS } from './compliance';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import type { GetState } from '../redux/reducer';
import type { ExtractReturn } from '../redux/helpers';

export const MINT_UPLOADED = 'token/mint/UPLOADED';
export const MINT_RESET_UPLOADED = 'token/mint/RESET_UPLOADED';
export const mintResetUploaded = () => ({ type: MINT_RESET_UPLOADED });

export const DATA = 'token/DATA';
export const data = (token: ?SecurityToken) => ({ type: DATA, token });

export const MINTING_FROZEN = 'token/MINTING_FROZEN';
export const mintingFrozen = (isMintingFrozen: boolean) => ({
  type: MINTING_FROZEN,
  isMintingFrozen,
});

export const COUNT_TM = 'token/COUNT_TM';
export const countTransferManager = (
  tm: CountTransferManager,
  isPaused: boolean,
  count?: ?number
) => ({ type: COUNT_TM, tm, isPaused, count });

export const FREEZE_STATUS = 'compliance/FREEZE_STATUS';
export type Action = ExtractReturn<typeof data>;

export type InvestorCSVRow = [number, string, string, string, string, string];

export const fetch = (ticker: string, _token?: SecurityToken) => async (
  dispatch: Function
) => {
  dispatch(ui.fetching());
  try {
    const str = await SecurityTokenRegistry.create();
    const token: SecurityToken = _token || (await str.getTokenByTicker(ticker));
    dispatch(data(token));

    let countTM;
    if (token.contract) {
      // $FlowFixMe
      countTM = await token.contract.getCountTM();
      if (countTM) {
        dispatch(
          countTransferManager(
            countTM,
            await countTM.paused(),
            await countTM.maxHolderCount()
          )
        );
      }
      // $FlowFixMe
      const isMintingFrozen = !(await token.contract.isIssuable());
      dispatch(mintingFrozen(isMintingFrozen));

      // $FlowFixMe
      let FREEZE_ISSUANCE = 'FreezeIssuance';
      if (semver.lt(token.contract.version, LATEST_PROTOCOL_VERSION))
        FREEZE_ISSUANCE = 'FreezeMinting';

      token.contract.subscribe(FREEZE_ISSUANCE, {}, event => {
        dispatch(mintingFrozen(true));
      });

      // $FlowFixMe
      token.contract.subscribe('FreezeTransfers', {}, event => {
        // eslint-disable-next-line
        dispatch({
          type: FREEZE_STATUS,
          freezeStatus: !!event.returnValues._status,
        });
      }); // $FlowFixMe
      const frozenInit = await token.contract.transfersFrozen();
      dispatch({ type: FREEZE_STATUS, freezeStatus: frozenInit });
    }

    if (!token.contract || !countTM) {
      dispatch(countTransferManager(null, true, null));
    }

    dispatch(fetchSTO());
    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

export const LEGACY_TOKEN = 'token/LEGACY_TOKEN';

export const FETCHING_LEGACY_TOKENS = 'token/FETCHING_LEGACY_TOKENS';

export const fetchLegacyToken = (ticker: string) => async (
  dispatch: Function
) => {
  dispatch({ type: FETCHING_LEGACY_TOKENS });
  const { web3WS, account } = Contract._params;
  const networkId = await web3WS.eth.net.getId();

  // Fetch only on mainnet
  if (String(networkId) !== MAINNET_NETWORK_ID) {
    dispatch({ type: LEGACY_TOKEN, legacyToken: null });
    return;
  }

  // Fetch the tokens using the etherscan API
  const logs = await axios.get('https://api.etherscan.io/api', {
    params: {
      module: 'logs',
      action: 'getLogs',
      fromBlock: 0,
      toBlock: 'latest',
      address: LegacySTRArtifact.networks[networkId].address,
      topic0: web3WS.utils.sha3('LogNewSecurityToken(string,address,address)'),
      apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
    },
  });

  // Decode the logs using the ABI
  const inputs = LegacySTRArtifact.abi.find(
    o => o.name === 'LogNewSecurityToken' && o.type === 'event'
  ).inputs;

  for (const legacyToken of logs.data.result) {
    const data = web3WS.eth.abi.decodeLog(
      inputs,
      legacyToken.data,
      legacyToken.topics.slice(1)
    );

    const { _ticker: thisTicker, _securityTokenAddress: address } = data;

    const legacyTokenContract = new web3WS.eth.Contract(
      LegacySTArtifact.abi,
      address
    );

    const currentOwner = await legacyTokenContract.methods.owner().call();

    if (
      web3WS.utils.toChecksumAddress(currentOwner) ===
        web3WS.utils.toChecksumAddress(account) &&
      thisTicker.toUpperCase() === ticker.toUpperCase()
    ) {
      return dispatch({
        type: LEGACY_TOKEN,
        legacyToken: {
          ticker,
          address,
        },
      });
    }
  }

  dispatch({ type: LEGACY_TOKEN, legacyToken: null });
};

export const issue = (values: Object) => async (
  dispatch: Function,
  getState: GetState
) => {
  const { ticker, limitInvestors } = values;
  const str = await SecurityTokenRegistry.create();
  const fee = await str.launchFee();
  const feeView = ui.thousandsDelimiter(fee); // $FlowFixMe

  const allowance = await PolyToken.allowance(str.account, str.address);

  const isApproved = allowance >= fee;

  dispatch(
    ui.confirm(
      <div>
        <p>
          Completion of your token configuration will require{' '}
          {limitInvestors ? 'three' : !isApproved ? 'two' : 'one'} wallet
          transaction(s).
        </p>
        {!isApproved ? (
          <div>
            <p>
              • The first transaction will be used to prepare for the payment of
              the token configuration cost of:
            </p>
            <div className="bx--details poly-cost">{feeView} POLY</div>
          </div>
        ) : (
          ''
        )}
        <p>
          • {!isApproved ? 'The second' : 'This'} transaction will be used to
          pay for the token configuration cost (POLY + mining fee) to complete
          the configuration of your token.
        </p>
        {limitInvestors && (
          <p>
            • The {!isApproved ? 'third' : 'second'} transaction will be used to
            pay the mining fee (aka gas fee) to limit the number of investors
            who can hold your token.
            <br />
          </p>
        )}
        <p>
          Please hit &laquo;CONFIRM&raquo; when you are ready to proceed. Once
          you hit &laquo;CONFIRM&raquo;, your security token will be configured
          on the blockchain.
          <br />
          If you do not wish to pay the token configuration fee or wish to
          review your information, simply select &laquo;CANCEL&raquo;.
        </p>
      </div>,
      async () => {
        // $FlowFixMe
        if (getState().pui.account.balance.lt(fee)) {
          dispatch(
            ui.faucet(
              `The configuration of a security token has a fixed cost of ${feeView} POLY.`
            )
          );
          return;
        }

        // const allowance = await PolyToken.allowance(
        //   SecurityTokenRegistry.account,
        //   SecurityTokenRegistry.address
        // );

        //Skip approve transaction if transfer is already allowed
        let title = ['Configuring Security Token'];

        if (!isApproved) {
          title.unshift('Approving POLY Spend');
        }

        title.push(...(limitInvestors ? ['Limiting Number Of Investors'] : []));

        let createdToken;

        const continueCallback = () => {
          // $FlowFixMe
          return dispatch(fetch(ticker, createdToken));
        };

        dispatch(
          ui.tx(
            title,
            async () => {
              await str.generateSecurityToken(values);

              if (limitInvestors) {
                createdToken = await str.getTokenByTicker(ticker);
                try {
                  await createdToken.contract.setCountTM(
                    values.investorsNumber
                  );
                } catch (err) {
                  throw new Error(
                    'Error limiting the number of investors. Please click on "Continue" to proceed to the next step where you can enable this limit.'
                  );
                }
              }
            },
            'Token Was Issued Successfully',
            continueCallback,
            continueCallback,
            `/dashboard/${ticker}`,
            undefined,
            false,
            ticker.toUpperCase() + ' Token Configuration'
          )
        );
      },
      `Before you Proceed with Your ${ticker.toUpperCase()} Token Configuration`,
      undefined,
      'pui-large-confirm-modal'
    )
  );
};

export const uploadCSV = (file: Object) => async (dispatch: Function) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = async () => {
    const config = {
      headers: [
        {
          name: 'ETH Address',
          inputName: 'address',
          required: true,
          unique: true,
          validate: function(val) {
            return validateAddress(val);
          },
          validateError,
          headerError,
          uniqueError,
          requiredError,
        },
        {
          name: 'Sell Restriction Date',
          inputName: 'from',
          validate: function(val) {
            return val.length === 0 || validateDate(val);
          },
          validateError,
          headerError,
        },
        {
          name: 'Buy Restriction Date',
          inputName: 'to',
          validate: function(val) {
            return val.length === 0 || validateDate(val);
          },
          validateError,
          headerError,
        },
        {
          name: 'KYC/AML Expiry Date',
          inputName: 'expiry',
          required: true,
          validate: function(val) {
            return validateDate(val);
          },
          validateError,
          headerError,
          requiredError,
        },
        {
          name: 'Number of tokens',
          inputName: 'tokensVal',
          required: true,
          validate: function(val) {
            return !isNaN(val);
          },
          validateError,
          headerError,
          requiredError,
        },
      ],
    };

    let investors = [];
    let tokens = [];

    let isTooMany = false;
    let string = 0;

    try {
      const { data, validationErrors } = await CSVFileValidator(
        reader.result,
        config
      );
      isTooMany = data.length > 50;

      if (validationErrors.length) {
        dispatch({
          type: MINT_UPLOADED,
          investors: [],
          tokens: [],
          criticals: validationErrors,
          isTooMany,
          isInvalidFormat: '',
        });
      } else {
        data.forEach(({ address, from, to, purchase, expiry, tokensVal }) => {
          investors.push({
            address,
            from: from.length ? new Date(from) : new Date(PERMANENT_LOCKUP_TS),
            to: to.length ? new Date(to) : new Date(PERMANENT_LOCKUP_TS),
            expiry: new Date(expiry),
          });

          tokens.push(Number(tokensVal));
        });

        dispatch({
          type: MINT_UPLOADED,
          investors,
          tokens,
          criticals: [],
          isTooMany,
          isInvalidFormat: '',
        });
      }
    } catch (err) {
      // Parsing error
      dispatch({
        type: MINT_UPLOADED,
        investors,
        tokens,
        criticals: [],
        isTooMany,
        isInvalidFormat: err.message,
      });
    }
  };
};

export const mintTokens = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const {
    token,
    mint: { uploaded, uploadedTokens },
  } = getState().token; // $FlowFixMe
  const transferManager = await token.contract.getTransferManager();

  dispatch(
    ui.tx(
      ['Whitelisting Addresses', 'Minting Tokens'],
      async () => {
        await transferManager.modifyKYCDataMulti(uploaded);
        const addresses: Array<Address> = [];
        for (let investor: Investor of uploaded) {
          addresses.push(investor.address);
        } // $FlowFixMe

        await token.contract.issueMulti(addresses, uploadedTokens);
      },
      'Tokens were successfully minted',
      () => {
        return dispatch(mintResetUploaded());
      },
      undefined,
      undefined,
      undefined,
      true // TODO @bshevchenko
    )
  );
};

export const limitNumberOfInvestors = (count?: number) => async (
  dispatch: Function,
  getState: GetState
) => {
  const oldCount = getState().token.countTM.count;
  const tm = getState().token.countTM.contract;
  dispatch(
    ui.confirm(
      tm && oldCount ? (
        <div>
          <p>
            Please confirm that you want to change the limit on the number of
            token holders to <strong>{ui.thousandsDelimiter(oldCount)}</strong>.
          </p>
          <p>
            Note that all transactions that would result in a number of token
            holders greater than the limit will fail. Please make sure your
            Investors are informed accordingly.
          </p>
        </div>
      ) : (
        <div>
          <p>
            Please confirm that you want to set a limit to the number of token
            holders.
          </p>
          <p>
            Note that all transactions that would result in a number of token
            holders greater than the limit will fail. Please make sure your
            Investors are informed accordingly.
          </p>
        </div>
      ),
      async () => {
        // $FlowFixMe
        if (tm) {
          dispatch(
            ui.tx(
              'Resuming Token Holders Number Limit',
              async () => {
                await tm.unpause();
              },
              'Token holders number limit has been resumed successfully',
              () => {
                dispatch(countTransferManager(tm, false));
              },
              undefined,
              undefined,
              undefined,
              true // TODO @bshevchenko
            )
          );
        } else {
          // $FlowFixMe
          const st: SecurityToken = getState().token.token.contract;
          dispatch(
            ui.tx(
              'Enabling Token Holders Number Limit',
              async () => {
                await st.setCountTM(count);
              },
              'Token holders number limit has been enabled successfully',
              async () => {
                dispatch(
                  countTransferManager(await st.getCountTM(), false, count)
                );
              },
              undefined,
              undefined,
              undefined,
              true // TODO @bshevchenko
            )
          );
        }
      },
      'Enabling Limit on the Number of Token Holders'
    )
  );
};

export const unlimitNumberOfInvestors = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <div>
        <p>
          Please confirm that you want to disable limit on the number of token
          holders.
        </p>
      </div>,
      async () => {
        const tm = getState().token.countTM.contract;
        dispatch(
          ui.tx(
            'Pausing Token Holders Number Limit',
            async () => {
              // $FlowFixMe
              await tm.pause();
            },
            'Token holders number limit has been paused successfully',
            async () => {
              dispatch(countTransferManager(tm, true));
            },
            undefined,
            undefined,
            undefined,
            true // TODO @bshevchenko
          )
        );
      }
    )
  );
};

export const updateMaxHoldersCount = (count: number) => async (
  dispatch: Function,
  getState: GetState
) => {
  const oldCount = Number(getState().token.countTM.count);
  const oldCountText = ui.thousandsDelimiter(oldCount);
  const tm = getState().token.countTM.contract;
  dispatch(
    ui.confirm(
      <div>
        <p>
          Please confirm that you want to change the limit on the number of
          token holders from <strong>{oldCountText}</strong> to{' '}
          <strong>{ui.thousandsDelimiter(count)}</strong>.
        </p>
        {count < oldCount ? (
          <p>
            Note that this operation will reduce the limit on the number of
            token holders. As such, only transactions that would result in a
            reduction of the number of token holders will be allowed. All other
            transactions, whether they would maintain or increase the number of
            token holders will fail. Please make sure your Investors are
            informed accordingly.
          </p>
        ) : (
          ''
        )}
      </div>,
      async () => {
        dispatch(
          ui.tx(
            'Updating max holders count',
            async () => {
              // $FlowFixMe
              await tm.changeHolderCount(count);
            },
            'Max holders count has been successfully updated',
            async () => {
              dispatch(countTransferManager(tm, false, count));
            },
            undefined,
            undefined,
            undefined,
            true // TODO @bshevchenko
          )
        );
      }
    )
  );
};

export const exportMintedTokensList = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <p>
        Are you sure you want to export the whitelist?
        <br />
        <br />
        Note that the whitelist export does not contain the settings for "Exempt
        From % Ownership" or information specific to the USD Tiered STO such as
        "Is Accredited" or "Non Accredited Limit".
        <br />
        This information will need to be appended to the file, should you wish
        to re-import its contents.
        <br />
        Please be aware that the time to complete this operation will vary based
        on the number of entries in the list.
      </p>,
      async () => {
        dispatch(ui.fetching());
        try {
          const { token } = getState().token; // $FlowFixMe
          const investors = await token.contract.getMinted();
          let csvContent =
            'ETH Address,Sell Restriction Date,Buy Restriction Date,KYC/AML Expiry Date,Number of tokens';
          investors.forEach((investor: Investor) => {
            csvContent +=
              '\r\n' +
              [
                investor.address, // $FlowFixMe
                investor.from.getTime() === PERMANENT_LOCKUP_TS
                  ? ''
                  : moment(investor.from).format('MM/DD/YYYY'),
                // $FlowFixMe
                investor.to.getTime() === PERMANENT_LOCKUP_TS
                  ? ''
                  : moment(investor.to).format('MM/DD/YYYY'),
                moment(investor.expiry).format('MM/DD/YYYY'), // $FlowFixMe
                investor.minted.toString(10),
              ].join(',');
          });

          const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8',
          });
          FileSaver.saveAs(blob, 'mintedTokenList.csv');

          dispatch(ui.fetched());
        } catch (e) {
          dispatch(ui.fetchingFailed(e));
        }
      },
      'Proceeding with Minted Tokens List Export'
    )
  );
};
