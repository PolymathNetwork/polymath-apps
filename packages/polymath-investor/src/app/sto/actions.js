import React from 'react'
import BigNumber from 'bignumber.js'
import * as ui from 'polymath-ui'
import { reset } from 'redux-form'
import { PolyToken, SecurityTokenRegistry } from 'polymathjs'

import config from '../../config.json'
import { formName } from './PurchaseForm'
import type { ExtractReturn } from '../../redux/helpers'
import type { GetState } from '../../redux/reducer'

export const DATA = 'sto/DATA'
export const PURCHASE_MODAL_OPEN = 'sto/PURCHASE_MODAL_OPEN'

export const PURCHASE_MODAL_CLOSE = 'sto/PURCHASE_MODAL_CLOSE'
export const purchaseModalClose = () => (dispatch: Function) => {
  dispatch({ type: PURCHASE_MODAL_CLOSE })
  dispatch(reset(formName))
}

export const PAUSE_STATUS = 'sto/PAUSE_STATUS'
export const pauseStatus = (status: boolean) => ({ type: PAUSE_STATUS, status })

export type Action =
  | ExtractReturn<typeof pauseStatus>

export const fetch = (ticker?: string) => async (dispatch: Function) => {
  dispatch(ui.fetching())
  try {
    const token = await SecurityTokenRegistry.getTokenByTicker(config.ticker || ticker)
    let sto, details
    if (token) {
      sto = await token.contract.getSTO()
      if (sto) {
        details = await sto.getDetails()
        dispatch(pauseStatus(await sto.paused()))
        // noinspection JSIgnoredPromiseFromCall
        sto.subscribe('Pause', {}, () => {
          dispatch(pauseStatus(true))
        }) // noinspection JSIgnoredPromiseFromCall
        sto.subscribe('Unpause', {}, () => {
          dispatch(pauseStatus(false))
        })
      }
    }
    dispatch({ type: DATA, token, sto, details })
    dispatch(ui.fetched())
  } catch (e) {
    dispatch(ui.fetchingFailed(e))
  }
}

export const purchasePrep = () => async (dispatch: Function, getState: GetState) => {
  const { token } = getState().sto
  const { account } = getState().network
  const st = token.contract
  if (!(await st.verifyTransfer(0, account, 1))) {
    dispatch(ui.confirm(
      <div>
        Your wallet address cannot participate into this token sale.
        Please contact the Issuer of the {token.ticker} security token for resolution.
      </div>,
      () => {},
      'Unable to Purchase Tokens',
      'Understood',
      '',
      'Transaction Error',
      true
    ))
    return
  }
  // TODO @bshevchenko: reset purchase form values
  dispatch({ type: PURCHASE_MODAL_OPEN })
}

export const purchase = () => async (dispatch: Function, getState: GetState) => {
  let { tokens } = getState().form[formName].values
  tokens = new BigNumber(tokens)
  dispatch(purchaseModalClose())

  let { token, sto, details } = getState().sto
  const { account } = getState().network
  const st = token.contract
  const value = (new BigNumber(tokens)).div(details.rate)

  let allowance
  let isSufficientAllowance
  if (details.isPolyFundraise) {
    allowance = await PolyToken.allowance(account, sto.address)
    isSufficientAllowance = allowance.gte(value)
  }

  let polyConfirmText = <span />
  if (details.isPolyFundraise) {
    if (!isSufficientAllowance) {
      polyConfirmText = (
        <p>
          Completion of your {token.ticker} token purchase will require
          two wallet transactions:<br />
          • The first transaction will be used to approve the payment of POLY<br />
          • The second transaction will be used to transfer the POLY and complete the purchase of {token.ticker} tokens.
        </p>
      )
    } else {
      polyConfirmText = (
        <p>
          Usually completion of your {token.ticker} token purchase require two wallet transactions:<br />
          • The first transaction to approve the payment of POLY<br />
          • The second transaction to transfer the POLY and complete the purchase of {token.ticker} tokens.<br />
          But you already approved POLY payment earlier, so now you will have to sign only second transaction.
        </p>
      )
    }
  }

  dispatch(ui.confirm(
    <div>
      You are going to purchase <strong>{ui.thousandsDelimiter(tokens)} {token.ticker}</strong> tokens
      for <strong>{ui.thousandsDelimiter(value)} {details.isPolyFundraise ? 'POLY' : 'ETH'}</strong>.
      {polyConfirmText}
    </div>,
    async () => {
      if (!(await st.verifyTransfer(0, account, tokens))) {
        dispatch(ui.confirm(
          <div>
            You are not allowed to receive {ui.thousandsDelimiter(tokens)} {token.ticker}.<br />
            Try lower value.
          </div>,
          () => {},
          'Unable to Purchase Tokens',
          'Understood',
          '',
          'Transaction Error',
          true
        ))
        return
      }
      details = await sto.getDetails()
      if (!details.tokensSold.add(tokens).lte(details.cap)) {
        dispatch(ui.confirm(
          <div>
            The maximum number of tokens that you can now purchase
            is <strong>{ui.thousandsDelimiter(details.cap.minus(details.tokensSold))}</strong>.
          </div>,
          () => {},
          'Unable to Purchase Tokens',
          'Understood',
          '',
          'Transaction Error',
          true
        ))
        return
      }
      dispatch(ui.tx(
        [...(details.isPolyFundraise && !isSufficientAllowance ? ['Approving POLY Spend'] : []), 'Token Purchase'],
        async () => {
          await sto.buy(value)
        },
        `Congratulations! You Completed Your Purchase of ${ui.thousandsDelimiter(tokens)} of ${token.ticker} Tokens`,
        () => {
          dispatch(fetch(token.ticker))
        },
        undefined,
        undefined,
        true
      ))
    },
    `Proceeding with Your Purchase of ${token.ticker} Tokens`,
  ))
}
