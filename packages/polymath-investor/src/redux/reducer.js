// @flow

import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as network } from 'polymath-auth'
import { reducer as pui } from 'polymath-ui'
import type { PUIState } from 'polymath-ui'
import type { NetworkState } from 'polymath-auth'

import sto from '../app/sto/reducer'
import type { STOState } from '../app/sto/reducer'

export default combineReducers({
  network,
  sto,
  pui,
  form,
})

export type RootState = {
  network: NetworkState,
  sto: STOState,
  pui: PUIState,
  form: any,
}

export type GetState = () => RootState
