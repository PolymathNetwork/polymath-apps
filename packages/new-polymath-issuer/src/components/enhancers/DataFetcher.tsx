import React, { Component, Dispatch, ReactNode } from 'react';
import { connect } from 'react-redux';
import { intersectionWith, isEqual } from 'lodash';
import { ActionType } from 'typesafe-actions';
import { Loading } from '@polymathnetwork/new-ui';
import { RootState } from '~/state/store';
import {
  createGetEntitiesFromCache,
  createGetLoadingStatus,
  createGetFetchersErrorMessages,
} from '~/state/selectors';
import { requestData } from '~/state/actions/dataRequests';
import { Fetcher, FetchedData } from '~/types';

interface OwnProps {
  watchProps?: { [key: string]: any };
  fetchers: Fetcher[];
  renderLoading: () => ReactNode;
  renderError: (errors: string[]) => ReactNode;
  render(props: FetchedData): ReactNode;
}

interface StateProps {
  fetchedData: FetchedData;
  loading: boolean;
  errors: string[];
}

interface DispatchProps {
  dispatch: Dispatch<ActionType<typeof requestData>>;
}

type Props = OwnProps & StateProps & DispatchProps;

const mapStateToProps = () => {
  const getEntitiesFromCache = createGetEntitiesFromCache();
  const getLoadingStatus = createGetLoadingStatus();
  const getErrorMessages = createGetFetchersErrorMessages();

  return (state: RootState, props: OwnProps): StateProps => {
    const fetchedData = getEntitiesFromCache(state, props);
    const loading = getLoadingStatus(state, props);
    const errors = getErrorMessages(state, props);

    return {
      fetchedData,
      loading,
      errors,
    };
  };
};

class DataFetcherBase extends Component<Props> {
  public static defaultProps = {
    // NOTE @RafaelVidaurre: Hardcoding this for now until we have an error
    // component for this
    renderError: (errors: string[]) => <div>{errors[0]}</div>,
    renderLoading: () => <Loading />,
  };

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
  public shouldComponentUpdate(nextProps: Props) {
    const { fetchers, loading, fetchedData, watchProps } = this.props;
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

    const watchPropsUpdated = !isEqual(watchProps, nextProps.watchProps);

    return (
      fetcherIntersection.length !== fetchers.length ||
      !isEqual(fetchedData, newFetchedData) ||
      watchPropsUpdated
    );
  }
  public render() {
    const {
      render,
      fetchedData,
      renderLoading,
      renderError,
      errors,
      loading,
    } = this.props;

    if (errors.length) {
      return renderError(errors);
    }
    if (loading) {
      return renderLoading();
    }

    return render(fetchedData);
  }
}

const EnhancedDataFetcher = connect(mapStateToProps)(DataFetcherBase);

export const DataFetcher = Object.assign(EnhancedDataFetcher, {
  defaultProps: DataFetcherBase.defaultProps,
});
