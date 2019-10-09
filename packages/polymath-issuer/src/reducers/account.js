import * as a from '../actions/account';

const defaultState = {
  tickers: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case a.TICKER_LIST:
      return {
        tickers: [...action.tickers],
      };
    default:
      return state;
  }
};
