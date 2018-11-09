// @flow

import React from 'react';
import FileSaver from 'file-saver';
import { includes } from 'lodash';

import { STO, PolyToken } from '@polymathnetwork/js';
import * as ui from '@polymathnetwork/ui';
import { twelveHourTimeToMinutes } from '@polymathnetwork/ui/deprecated';
import {
  EMPTY_ADDRESS,
  DAI_ADDRESSES,
} from '@polymathnetwork/shared/constants';
import { setupSTOModule, getTokenSTO } from '../utils/contracts';
import USDTieredSTO from '../utils/contracts/USDTieredSTO';
import { FUND_RAISE_TYPES } from '../constants';

import type { Dispatch } from 'redux';
import type { TwelveHourTime } from '@polymathnetwork/ui/deprecated';
import type { STOConfig } from '../constants';
import type { RootState } from '../redux/reducer';
import type {
  STOFactory,
  STODetails,
  STOPurchase,
} from '@polymathnetwork/js/types';
import type { ExtractReturn } from '../redux/helpers';
import type { GetState } from '../redux/reducer';

export const DATA = 'sto/DATA';
export const data = (contract: STO, details: ?STODetails) => ({
  type: DATA,
  contract,
  details,
});

const STO_TYPE = 3;

const ConfigSTOConfirmContent = ({ setupCost }) => (
  <div>
    <p>
      Once submitted to the blockchain, the dates for your offering cannot be
      changed. Please confirm dates with your Advisor and Legal providers before
      you click on &laquo;CONFIRM&raquo;. Also, note that Investors must be
      added to the whitelist before or while the STO is live, so they can
      participate to your fundraise and that all necessary documentation must be
      posted on your Securities Offering Site.
    </p>
    <p>
      Completion of your STO smart contract deployment and scheduling will
      require two wallet transactions.
    </p>
    <p>
      • The first transaction will be used to pay for the smart contract fee of:
    </p>
    <div className="bx--details poly-cost">
      {setupCost.toString()}
      POLY
    </div>
    <p>
      • The second transaction will be used to pay the mining fee (aka gas fee)
      to complete the scheduling of your STO.
    </p>
    <p>
      Hit &laquo;CANCEL&raquo; if you would like to edit the information
      provided or &laquo;CONFIRM&raquo; if you have confirmed the details of
      your STO with your Advisor and are ready to proceed.
    </p>
  </div>
);

export const FACTORIES = 'sto/FACTORIES';
export const factories = (factories: Array<STOFactory>) => ({
  type: FACTORIES,
  factories,
});

// TODO @RafaelVidaurre: This should only save the picked address instead of the
// whole object
export const USE_FACTORY = 'sto/USE_FACTORY';
export const useFactory = (factory: STOFactory) => ({
  type: USE_FACTORY,
  factory,
});

export const PURCHASES = 'sto/PURCHASES';
export const purchases = (purchases: Array<STOPurchase>) => ({
  type: PURCHASES,
  purchases,
});

export const GO_BACK = 'sto/GO_BACK';
export const goBack = () => ({ type: GO_BACK });

export const PAUSE_STATUS = 'sto/PAUSE_STATUS';
export const pauseStatus = (status: boolean) => ({
  type: PAUSE_STATUS,
  status,
});

export type Action =
  | ExtractReturn<typeof data>
  | ExtractReturn<typeof pauseStatus>
  | ExtractReturn<typeof factories>;

// NOTE @RafaelVidaurre: Legacy action that retrieves initial state
// of the STO process. We need a better way to do this.
export const fetch = () => async (dispatch: Function, getState: GetState) => {
  dispatch(ui.fetching());
  try {
    const { token } = getState().token;

    // No token created yet
    if (!token || !token.contract) {
      dispatch(ui.fetched());
      return;
    }

    const sto = await getTokenSTO(token.address);
    if (sto) {
      const details = await sto.getDetails();
      dispatch(pauseStatus(details.pauseStatus));
      dispatch(data(sto, details));
    } else {
      dispatch(data(sto, null));
    }
    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

// TODO @bshevchenko: update when core will allow to retrieve factories list
export const fetchFactories = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const { token } = getState().token;
  if (!token) {
    return;
  }
  dispatch(ui.fetching());
  try {
    const stoTemplates = [];

    /**
     * Get supported module templates
     *
     * TODO @monitz87: refactor into `getSupportedModuleTemplates(token: SecurityToken)`
     * function when we add more modules
     */
    const cappedSTOFactory = await token.contract.getModuleFactory(
      'CappedSTO',
      STO_TYPE
    );
    const owner = await cappedSTOFactory.owner();
    if (cappedSTOFactory) {
      stoTemplates.push({
        title: 'Capped STO',
        name: 'Polymath Inc.',
        desc:
          'This smart contract creates a maximum number of tokens (i.e hard cap) which the total ' +
          'aggregate of tokens acquired by all investors cannot exceed. Security tokens are sent to the investor upon' +
          ' reception of the funds (ETH or POLY), and any security tokens left upon termination of the offering ' +
          'will not be minted.',
        isVerified: true,
        securityAuditLink: {
          title: 'Solidified',
          url:
            'https://github.com/PolymathNetwork/polymath-core/blob/master/audit%20reports/' +
            'Polymath%20Audit%20Report%20Final.pdf',
        },
        address: cappedSTOFactory.address,
        owner,
      });
    }

    dispatch(factories(stoTemplates));
    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

const dateTimeFromDateAndTime = (date: Date, time: TwelveHourTime) =>
  new Date(date.valueOf() + twelveHourTimeToMinutes(time) * 60000);

export const configureSTO = (
  moduleAddress: string,
  config: STOConfig
) => async (dispatch: Dispatch<any>, getState: GetState) => {
  const {
    token,
    stoModules,
    sto: { factory },
  }: RootState = getState();
  if (!token) {
    throw new Error(
      'configureSTO action was called before token state was initialized.'
    );
  }
  if (!stoModules.fetched) {
    throw new Error(
      'configureSTO action was called before stoModules state was initialized.'
    );
  }
  if (!factory) {
    // FIXME @RafaelVidaurre: Should be removed after routing is fixed
    throw new Error('Unexpected error, factory not set in state.');
  }

  const stoModule = stoModules.modules[factory.address];
  if (!stoModule) {
    throw new Error('Factory selected is not present in stoModules state');
  }

  const { setupCost } = stoModule;
  // TODO @RafaelVidaurre: Format setup cost

  dispatch(
    ui.confirm(
      <ConfigSTOConfirmContent setupCost={setupCost} />,
      async () => {
        const balance = getState().pui.account.balance;
        const hasEnoughBalance = balance.gte(setupCost);

        if (!hasEnoughBalance) {
          dispatch(
            ui.faucet(
              `The launching of a STO has a fixed cost of ${setupCost} POLY.`,
              setupCost
            )
          );
          return;
        }

        // NOTE @RafaelVidaurre: Legacy checks, verify if actually necessary
        const {
          token: { token },
          network: { id: networkId },
        } = getState();
        if (!token) {
          return;
        }

        const raisesInDai = includes(
          config.data.currencies,
          FUND_RAISE_TYPES.DAI
        );
        const daiTokenAddress = DAI_ADDRESSES[networkId];
        const usdTokenAddress = raisesInDai ? daiTokenAddress : EMPTY_ADDRESS;

        const stoModuleConfig = {
          ...config.data,
          usdTokenAddress,
        };

        dispatch(
          ui.tx(
            ['Approving POLY Spend', 'Deploying And Scheduling'],
            async () => {
              await setupSTOModule(stoModule, token.address, stoModuleConfig);
            },
            'STO Configured Successfully',
            () => {
              return dispatch(fetch());
            },
            `/dashboard/${token.ticker}/compliance`,
            undefined,
            false,
            token.ticker.toUpperCase() + ' STO Creation'
          )
        );
      },
      'Before You Proceed with your Security Token Offering Deployment and Scheduling',
      undefined,
      'pui-large-confirm-modal'
    )
  );
};

// TODO @RafaelVidaurre: Switch to new configure when CappedSTO is re-written, this is legacy now
export const configure = values => async (
  dispatch: Function,
  getState: GetState
) => {
  const { token } = getState().token;
  const cappedSTOFactory = await token.contract.getModuleFactory(
    'CappedSTO',
    STO_TYPE
  );
  const fee = await cappedSTOFactory.setupCost();
  const feeView = ui.thousandsDelimiter(fee);
  dispatch(
    ui.confirm(
      <ConfigSTOConfirmContent setupCost={feeView} />,
      async () => {
        // $FlowFixMe
        if (getState().pui.account.balance.lt(fee)) {
          dispatch(
            ui.faucet(
              `The launching of a STO has a fixed cost of ${feeView} POLY.`
            )
          );
          return;
        }
        const { factory } = getState().sto;
        const { token } = getState().token;
        if (!factory || !token || !token.contract) {
          return;
        }
        const balance = await PolyToken.balanceOf(token.address);
        //Skip approve transaction if transfer is already allowed
        let title = ['Deploying And Scheduling'];
        if (balance === 0) {
          title.unshift('Approving POLY Spend');
        }
        dispatch(
          ui.tx(
            title,
            async () => {
              const contract: any = token.contract;
              const [startDate] = values.startDate;
              const [endDate] = values.endDate;
              const startDateWithTime = dateTimeFromDateAndTime(
                startDate,
                values.startTime
              );
              const endDateWithTime = dateTimeFromDateAndTime(
                endDate,
                values.endTime
              );
              const isEthFundraise = values.currency === 'ETH';

              await contract.setCappedSTO(
                startDateWithTime,
                endDateWithTime,
                values.cap.replace(/,/g, ''),
                values.rate.replace(/,/g, ''),
                isEthFundraise,
                values.fundsReceiver
              );
            },
            'STO Configured Successfully',
            () => {
              return dispatch(fetch());
            },
            `/dashboard/${token.ticker}/compliance`,
            undefined,
            false,
            token.ticker.toUpperCase() + ' STO Creation'
          )
        );
      },
      'Before You Proceed with your Security Token Offering Deployment and Scheduling',
      undefined,
      'pui-large-confirm-modal'
    )
  );
};

export const fetchPurchases = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  try {
    const contract = getState().sto.contract; // $FlowFixMe
    dispatch(purchases(await contract.getPurchases()));
    dispatch(ui.fetched());
  } catch (e) {
    dispatch(ui.fetchingFailed(e));
  }
};

export const togglePauseSto = () => async (
  dispatch: Function,
  getState: GetState
) => {
  const isStoPaused = getState().sto.pauseStatus;
  dispatch(
    ui.confirm(
      isStoPaused ? (
        <div>
          <p>
            Once you hit &laquo;CONFIRM&raquo;, the STO will resume, allowing
            Investors to contribute funds again. Please consult with your
            Advisor and provide your Investors with sufficient disclosure prior
            to confirming the action.
            <br />
            If you are not sure or would like to consult your Advisor, simply
            select &laquo;CANCEL&raquo;.
          </p>
          <br />
          <ui.Remark title="Note">
            Your offering end-date will not be changed as a result of this
            operation.
          </ui.Remark>
        </div>
      ) : (
        <p>
          Once you hit &laquo;CONFIRM&raquo;, the STO will pause and Investors
          will no longer be able to contribute funds. Please consult with your
          Advisor and provide your Investors with sufficient disclosure prior to
          confirming the action.
          <br />
          If you are not sure or would like to consult your Advisor, simply
          select &laquo;CANCEL&raquo;.
        </p>
      ),
      async () => {
        dispatch(
          ui.tx(
            [isStoPaused ? 'Resuming STO' : 'Pausing STO'],
            async () => {
              const contract: STO = getState().sto.contract;
              if (isStoPaused) {
                await contract.unpause();
              } else {
                await contract.pause();
              }

              // NOTE @RafaelVidaurre: This is for legacy only, the STO state
              // contains pause state
              dispatch(pauseStatus(await contract.paused()));

              if (contract instanceof USDTieredSTO) {
                dispatch(fetch());
              }
            },
            isStoPaused
              ? 'Successfully Resumed STO'
              : 'Successfully Paused STO',
            undefined,
            undefined,
            undefined,
            true
          )
        );
      },
      `Before You Proceed with ${isStoPaused ? 'Resuming' : 'Pausing'} the STO`
    )
  );
};

export const exportInvestorsList = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(
    ui.confirm(
      <p>
        Are you sure you want to export investors list?
        <br />
        Please be aware that the time to complete this operation will vary based
        on the number of entries in the list.
      </p>,
      async () => {
        dispatch(ui.fetching());
        try {
          const contract = getState().sto.contract; // $FlowFixMe
          const purchases = await contract.getPurchases();

          console.log('purchases', purchases);

          let csvContent;

          // TODO @RafaelVidaurre: Dry and abstract this better
          // FIXME @RafaelVidaurre: Adapt when new CSV exports are merged
          if (contract instanceof USDTieredSTO) {
            csvContent =
              'data:text/csv;charset=utf-8,Address,Tokens Purchased,USD Amount Invested,Tier Number,Tier Price';

            purchases.forEach((purchase: STOPurchase) => {
              csvContent +=
                '\r\n' +
                [
                  purchase.investor,
                  purchase.tokens.toFormat(2),
                  purchase.usd.toFormat(2),
                  purchase.tier,
                  purchase.tierPrice.toFormat(2),
                ].join(',');
            });
          } else {
            csvContent =
              'data:text/csv;charset=utf-8,Address,Transaction Hash,Tokens Purchased,Amount Invested';

            purchases.forEach((purchase: STOPurchase) => {
              csvContent +=
                '\r\n' +
                [
                  purchase.investor,
                  purchase.txHash,
                  purchase.amount.toString(10),
                  purchase.paid.toString(10),
                ].join(',');
            });
          }

          const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8',
          });
          FileSaver.saveAs(blob, 'mintedTokenList.csv');

          dispatch(ui.fetched());
        } catch (e) {
          dispatch(ui.fetchingFailed(e));
        }
      },
      'Proceeding with Investors List Export'
    )
  );
};
