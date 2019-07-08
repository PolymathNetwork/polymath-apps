import React from 'react';
import { DataFetcher } from '../DataFetcher';
import { render } from '~/testUtils/helpers';
import { createCheckpointsBySymbolFetcher } from '~/state/fetchers';
import { createGetFetchersErrorMessages } from '~/state/selectors';
import { reducer } from '~/state/reducers/root';

jest.mock('~/state/selectors', () => {
  const original = require.requireActual('~/state/selectors');
  return {
    ...original,
    createGetFetchersErrorMessages: jest.fn(() => jest.fn(() => [])),
  };
});

describe('DataFetcher Container', () => {
  test.skip('should show the loading component while the fetcher is loading ', () => {});

  test.skip('should render if the fetcher succeeded', () => {});

  test.skip('if propKey is passed, it should pass the results on the requested key instead', () => {});

  test('should render an error component if the fetcher failed', () => {
    const state = reducer(undefined, {} as any);
    const errors = ['Some error'];
    if (!jest.isMockFunction(createGetFetchersErrorMessages)) {
      throw new Error('Module not mocked correctly');
    }
    createGetFetchersErrorMessages.mockImplementationOnce(() =>
      jest.fn(() => errors)
    );

    const renderSpy = jest.fn(() => <div>Rendered correctly</div>);
    const renderErrorSpy = jest.fn(() => <div>Got an error</div>);
    const fetcher = createCheckpointsBySymbolFetcher({
      symbol: 'FOO',
    });
    render(
      <DataFetcher
        renderError={renderErrorSpy}
        fetchers={[fetcher]}
        render={renderSpy}
      />,
      {
        state,
      }
    );

    expect(renderErrorSpy).toHaveBeenCalledWith(errors);
  });
});
