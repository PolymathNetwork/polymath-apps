import { polyClient } from '~/lib/polyClient';
import { cacheData } from '~/state/actions/dataRequests';
import { createAction as createTaxWithholding } from '~/state/actions/taxWithholdings';
import { call, put } from 'redux-saga/effects';
import { TaxWithholding, DividendModuleTypes } from '@polymathnetwork/sdk';
import { RequestKeys } from '~/types';

export function* fetchTaxWithholdingListBySymbol(args: {
  securityTokenSymbol: string;
  dividendType: DividendModuleTypes;
}) {
  const { securityTokenSymbol, dividendType } = args;
  const taxWithholdingList: TaxWithholding[] = yield call(
    polyClient.getDividendsTaxWithholdingList,
    {
      symbol: securityTokenSymbol,
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
      requestKey: RequestKeys.GetTaxWithholdingListBySymbol,
      args,
      fetchedIds,
    })
  );
}
