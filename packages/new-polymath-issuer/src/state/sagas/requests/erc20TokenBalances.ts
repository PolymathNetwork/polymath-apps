import { polyClient } from '~/lib/polyClient';
import { cacheData } from '~/state/actions/dataRequests';
import { createAction as createErc20TokenBalance } from '~/state/actions/erc20TokenBalances';
import { call, put } from 'redux-saga/effects';
import { Erc20TokenBalance } from '@polymathnetwork/sdk';
import { RequestKeys, GetErc20BalanceByAddressAndWalletArgs } from '~/types';

export function* fetchErc20TokenBalanceByAddressAndWallet(
  args: GetErc20BalanceByAddressAndWalletArgs
) {
  const { tokenAddress, walletAddress } = args;
  const tokenBalance: Erc20TokenBalance = yield call(
    polyClient.getErc20TokenBalance,
    {
      tokenAddress,
      walletAddress,
    }
  );

  const fetchedIds: string[] = [];

  if (tokenBalance) {
    const balancePojo = tokenBalance.toPojo();
    yield put(createErc20TokenBalance(balancePojo));
    fetchedIds.push(balancePojo.uid);
  }

  yield put(
    cacheData({
      requestKey: RequestKeys.GetErc20BalanceByAddressAndWallet,
      args: {
        tokenAddress,
        walletAddress,
      },
      fetchedIds,
    })
  );
}
