import { SecurityTokenRegistry } from '@polymathnetwork/js';
import * as ui from '@polymathnetwork/ui';

export const TICKER_LIST = 'account/TICKER_LIST';
export const getTickerList = tickers => ({
  type: TICKER_LIST,
  tickers,
});

export const fetchTickerList = () => async (
  dispatch: Function,
  getState: GetState
) => {
  dispatch(ui.fetching());
  const str = await SecurityTokenRegistry.create();
  const walletAddress = getState().session.wallet.address;
  const newTokens = await str.getTickersByOwner(walletAddress);
  dispatch(getTickerList(newTokens));
  dispatch(ui.fetched());
};
