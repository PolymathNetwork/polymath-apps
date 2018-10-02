// @flow
/* eslint-disable import/no-unresolved */

import { ToastNotification } from 'carbon-components-react';
import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import { connect } from 'react-redux';

import type { Notify } from './actions';

// this line would be 'style.scss' if we were to bundle with Webpack.
// noinspection JSFileReferences $FlowFixMe
import styles from '../../style.scss';
import type { RootState } from '../../redux/reducer';

type Toast = {|
  key: number,
  hiding: boolean,
  data: Object,
|};

export type ToastArgs = any;

type Props = {|
  notify: ?Notify,
|};

type State = {|
  toasts: Array<Toast>,
|};

const duration = 6000;

const mapStateToProps = (state: RootState): Props => ({
  notify: state.pui.toaster.notify,
});

class Toaster extends Component<Props, State> {
  static defaultProps = {
    notify: null,
  };

  state = {
    toasts: [],
  };

  componentWillReceiveProps(nextProps) {
    const notify = nextProps.notify;

    if (notify && notify !== this.props.notify) {
      this.show(
        {
          title: notify.title || '',
          subtitle: notify.subtitle || '',
          caption: notify.caption || null,
          kind: notify.isSuccess ? 'success' : 'error',
        },
        notify.isPinned || false
      );
    }
  }

  getToastIndexByKey = (state: State, key: number) =>
    state.toasts.map(toast => toast.key).indexOf(key);

  clear() {
    this.setState({ toasts: [] });
  }

  show(toast: ToastArgs, isPinned: boolean = false) {
    this.setState(previousState => {
      const toasts = previousState.toasts;
      const newKey =
        toasts.reduce(
          (max, toast) => Math.max(max, toast.key),
          toasts[0] ? toasts[0].key : 0
        ) + 1;

      if (!isPinned) {
        setTimeout(() => {
          this.startHidingKey(newKey);
        }, duration);
      }

      return {
        ...previousState,
        toasts: [
          {
            key: newKey,
            data: toast,
            hiding: false,
          },
          ...toasts,
        ],
      };
    });
  }

  startHidingKey = (key: number) => {
    this.setState(previousState => {
      const index = this.getToastIndexByKey(previousState, key);
      if (index === -1 || previousState.toasts[index].hiding) {
        return;
      }

      // noinspection JSUnresolvedVariable
      setTimeout(() => {
        this.removeKey(key);
      }, styles.toastAnimationDuration);

      return {
        ...previousState,
        toasts: Object.assign([...previousState.toasts], {
          [index]: {
            ...previousState.toasts[index],
            hiding: true,
          },
        }),
      };
    });
  };

  removeKey = (key: number) => {
    this.setState(previousState => {
      const index = this.getToastIndexByKey(previousState, key);
      if (index === -1) {
        return;
      }

      return {
        ...previousState,
        toasts: [
          ...previousState.toasts.slice(0, index),
          ...previousState.toasts.slice(index + 1),
        ],
      };
    });
  };

  render() {
    const toastElements = this.state.toasts.map(({ key, hiding, data }) => (
      <Transition key={key} in={!hiding} appear timeout={0}>
        {status => (
          <ToastNotification
            {...data}
            // eslint-disable-next-line
            onCloseButtonClick={() => this.removeKey(key)}
            className={`pui-toast pui-toast-${status}`}
          />
        )}
      </Transition>
    ));

    return (
      <div className="pui-toaster-container">
        <div className="pui-toaster">{toastElements}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Toaster);
