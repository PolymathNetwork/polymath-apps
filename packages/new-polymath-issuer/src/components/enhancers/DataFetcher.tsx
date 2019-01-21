import React, { Component, Dispatch, ReactNode } from 'react';
import { connect } from 'react-redux';
import { intersectionWith, isEqual } from 'lodash';
import { ActionType } from 'typesafe-actions';
import { Loading } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';
import {
  createGetEntitiesFromCache,
  createGetCacheStatus,
} from '~/state/selectors';
import { fetchData } from '~/state/actions/dataRequests';
import { Fetcher, CacheStatus, FetchedData } from '~/types';

interface OwnProps {
  fetchers: Fetcher[];
  render(props: FetchedData): ReactNode;
}

interface StateProps {
  fetchedData: FetchedData;
  cache: CacheStatus[];
  loading: boolean;
}

interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof fetchData>>;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = () => {
  const entitiesSelector = createGetEntitiesFromCache();
  const cacheSelector = createGetCacheStatus();

  return (state: RootState, props: OwnProps): StateProps => {
    const fetchedData = entitiesSelector(state, props);
    const unfilteredCache = cacheSelector(state, props);

    const cache = unfilteredCache.filter(
      cacheStatus => cacheStatus.mustBeFetched
    );

    console.log(cache);
    const loading = !!cache.length;

    console.log('LOADING', loading);

    return {
      fetchedData,
      cache,
      loading,
    };
  };
};

class DataFetcherBase extends Component<Props> {
  public getData() {
    const { dispatch, cache } = this.props;

    cache.forEach(cacheStatus => {
      const { args, requestKey } = cacheStatus;
      dispatch(
        fetchData({
          requestKey,
          args,
        })
      );
    });
  }

  public componentDidMount() {
    console.log('DID MOUNT');
    this.getData();
  }

  public componentWillUpdate() {
    console.log('WILL UPDATE');
    this.getData();
  }

  /**
   * Only update if the fetchers change
   */
  public shouldComponentUpdate(
    nextProps: Readonly<Props>,
    _nextState: Readonly<{}>
  ) {
    const { fetchers, loading, fetchedData, cache } = this.props;
    const {
      fetchers: newFetchers,
      loading: newLoading,
      fetchedData: newFetchedData,
      cache: newCache,
    } = nextProps;

    return loading !== newLoading;

    const fetcherIntersection = intersectionWith(
      fetchers,
      newFetchers,
      isEqual
    );
    const cacheIntersection = intersectionWith(cache, newCache, isEqual);
    console.log('OLD CACHE', cache);
    console.log('NEW CACHE', newCache);
    console.log('CACHE INTERSECTION', cacheIntersection);

    return (
      fetcherIntersection.length !== fetchers.length ||
      cacheIntersection.length !== cache.length ||
      !isEqual(fetchedData, newFetchedData)
    );
  }
  public render() {
    const { render, fetchedData, loading } = this.props;

    if (loading) {
      console.log('STILL LOADING');
      return <Loading />;
    }

    console.log(fetchedData);
    console.log('NOT LOADING ANYMORE');

    return render(fetchedData);
  }
}

export const DataFetcher = connect(mapStateToProps)(DataFetcherBase);
