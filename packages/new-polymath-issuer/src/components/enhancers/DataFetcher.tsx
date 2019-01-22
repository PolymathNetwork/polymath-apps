import React, { Component, Dispatch, ReactNode } from 'react';
import { connect } from 'react-redux';
import { intersectionWith, isEqual } from 'lodash';
import { ActionType } from 'typesafe-actions';
import { Loading } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';
import {
  createGetEntitiesFromCache,
  createGetLoadingStatus,
} from '~/state/selectors';
import { requestData } from '~/state/actions/dataRequests';
import { Fetcher, FetchedData } from '~/types';

interface OwnProps {
  fetchers: Fetcher[];
  render(props: FetchedData): ReactNode;
}

interface StateProps {
  fetchedData: FetchedData;
  loading: boolean;
}

interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof requestData>>;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = () => {
  const entitiesSelector = createGetEntitiesFromCache();
  const loadingSelector = createGetLoadingStatus();

  return (state: RootState, props: OwnProps): StateProps => {
    const fetchedData = entitiesSelector(state, props);

    const loading = loadingSelector(state, props);

    return {
      fetchedData,
      loading,
    };
  };
};

class DataFetcherBase extends Component<Props> {
  public getData() {
    const { dispatch, fetchers } = this.props;

    fetchers.forEach(fetcher => {
      dispatch(
        requestData({
          fetcher,
        })
      );
    });
  }

  public componentDidMount() {
    this.getData();
  }

  public componentDidUpdate() {
    this.getData();
  }

  /**
   * Only update if the fetchers change
   */
  public shouldComponentUpdate(
    nextProps: Readonly<Props>,
    _nextState: Readonly<{}>
  ) {
    const { fetchers, loading, fetchedData } = this.props;
    const {
      fetchers: newFetchers,
      loading: newLoading,
      fetchedData: newFetchedData,
    } = nextProps;

    if (loading !== newLoading) {
      return true;
    }

    const fetcherIntersection = intersectionWith(
      fetchers,
      newFetchers,
      isEqual
    );

    return (
      fetcherIntersection.length !== fetchers.length ||
      !isEqual(fetchedData, newFetchedData)
    );
  }
  public render() {
    const { render, fetchedData, loading } = this.props;

    if (loading) {
      return <Loading />;
    }

    return render(fetchedData);
  }
}

export const DataFetcher = connect(mapStateToProps)(DataFetcherBase);
