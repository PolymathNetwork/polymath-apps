import { polyClient } from '~/lib/polyClient';
import { cacheData } from '~/state/actions/dataRequests';
import { createAction as createTaxWithholding } from '~/state/actions/taxWithholdings';
import { call, put } from 'redux-saga/effects';
import { TaxWithholding } from '@polymathnetwork/sdk';
import {
  RequestKeys,
  GetTaxWithholdingListBySymbolAndCheckpointArgs,
} from '~/types';

export function* fetchTaxWithholdingListBySymbolAndCheckpoint(
  args: GetTaxWithholdingListBySymbolAndCheckpointArgs
) {
  const { symbol, checkpointId, dividendType } = args;
  const taxWithholdingList: TaxWithholding[] = yield call(
    polyClient.getDividendsTaxWithholdingList,
    {
      symbol: symbol,
      checkpointId,
      dividendType,
    }
  );

  const fetchedIds: string[] = [];

  const taxWithholdingPojos = taxWithholdingList.map(taxWithholding =>
    taxWithholding.toPojo()
  );
  for (const taxWithholding of taxWithholdingPojos) {
    fetchedIds.push(taxWithholding.uid);

    yield put(createTaxWithholding(taxWithholding));
  }

  yield put(
    cacheData({
      requestKey: RequestKeys.GetTaxWithholdingListBySymbolAndCheckpoint,
      args,
      fetchedIds,
    })
  );
}
