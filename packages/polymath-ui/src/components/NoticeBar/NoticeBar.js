// @flow
/* eslint-disable jsx-a11y/click-events-have-key-events, react/no-danger */
import React, { Component } from 'react';
import { Icon } from 'carbon-components-react';
import { connect } from 'react-redux';
import clamp from 'clamp-js-main';
import ReactDOMServer from 'react-dom/server';

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
            <p className="pui-notice-bar-title-text">{notice.title}</p>
          </div>
          <div className="pui-notice-bar-text-container">
            <p
              className="pui-notice-bar-text"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </div>
          <div className="pui-notice-bar-button-container">
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
      </div>
    );
  }

  componentDidUpdate() {
    /**
     * NOTE @monitz87: I had to use this fork of the 'clamp-js' library (https://www.npmjs.com/package/clamp-js-main)
     * because line clamping is horribly unsupported in CSS (and what little support there is is very browser-specific).
     * What this code does is truncate the title and paragraph (maintaining the integrity of any HTML elements inside it) if they
     * exceeds 2 lines, adding ellipses to replace the missing text
     */
    const paragraph = document.getElementsByClassName('pui-notice-bar-text')[0];
    // If the notice is closed the element disappears
    if (paragraph) {
      clamp(paragraph, { clamp: 2 });
    }

    const title = document.getElementsByClassName(
      'pui-notice-bar-title-text'
    )[0];
    // If the notice is closed the element disappears
    if (title) {
      clamp(title, { clamp: 2 });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoticeBar);
