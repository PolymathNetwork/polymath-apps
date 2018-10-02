// @flow
/* eslint-disable jsx-a11y/click-events-have-key-events, react/no-danger */
import React, { Component } from 'react';
import { Icon } from 'carbon-components-react';
import { connect } from 'react-redux';

import { closeNotice } from './actions';
import type { RootState } from '../../redux/reducer';

import './style.scss';

type StateProps = {|
  isOpen: boolean,
  notice: Object,
|};

type DispatchProps = {|
  closeNotice: () => any,
|};
// eslint-disable-next-line $FlowFixMe
const mapStateToProps = (state: RootState): StateProps => ({
  isOpen: state.pui.notice.isOpen,
  notice: state.pui.notice.notice,
});

const mapDispatchToProps: DispatchProps = {
  closeNotice,
};

type Props = {||} & StateProps & DispatchProps;

class NoticeBar extends Component<Props> {
  handleClose = () => {
    this.props.closeNotice();
  };

  render() {
    const { isOpen, notice } = this.props;
    if (!isOpen) {
      return <span />;
    }
    let kind = notice.type;
    return (
      <div className={'pui-notice-bar pui-notice-bar-' + kind}>
        <div className="pui-notice-bar-contents">
          <div className="pui-notice-bar-title">
            <Icon
              name={kind + '--glyph'}
              fill="#ffffff"
              width="24"
              height="25"
            />
            {notice.title}
          </div>
          <div
            className="pui-notice-bar-text"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
          <div
            role="button"
            className="pui-notice-bar-close"
            onClick={this.handleClose}
            tabIndex={0}
          >
            <Icon name="close--glyph" fill="#ffffff" width="16" height="16" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeBar);
