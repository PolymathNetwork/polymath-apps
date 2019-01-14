// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Icon,
  FileUploader,
  Button,
  InlineNotification,
} from 'carbon-components-react';
import { Remark } from '@polymathnetwork/ui';
import { uploadCSV, resetUploaded } from '../../../actions/compliance';

import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  isTooMany: boolean,
  parseError: String,
  isReady: boolean,
  isInvalid: boolean,
|};

type DispatchProps = {|
  uploadCSV: (file: Object) => any,
  resetUploaded: () => any,
|};

type Props = {|
  isOpen: boolean,
  onClose: () => any,
  onSubmit: (file: ?Object) => any,
|} & StateProps &
  DispatchProps;

const mapStateToProps = (state: RootState) => ({
  isTooMany: state.whitelist.isTooMany,
  parseError: state.whitelist.parseError,
  isReady: state.whitelist.uploaded.length > 0,
  isInvalid: state.whitelist.criticals.length > 0,
});

const mapDispatchToProps = {
  uploadCSV,
  resetUploaded,
};

class ImportWhitelistModal extends Component<Props> {
  handleClose = () => {
    // TODO @bshevchenko: maybe there is a better way to reset FileUploader $FlowFixMe
    const node = this.fileUploader.nodes[0];
    if (node) {
      const el = Array.from(node.getElementsByClassName('bx--file-close'))[0];
      const event = document.createEvent('Events');
      event.initEvent('click', true, false);
      el.dispatchEvent(event);
    }
    this.props.onClose();
  };

  handleSubmit = () => {
    this.handleClose();
    this.props.onSubmit();
  };

  handleUploaded = async (event: Object) => {
    const file = event.target.files[0];
    if (file.type.match(/csv.*/) || file.name.match(/.*\.csv$/i)) {
      await this.props.uploadCSV(file);
      //NOTE @sajclarke: This hack is necessary to add an eventlistener to the dynamic filename container from FileUploader
      const node = this.fileUploader.nodes[0];
      if (node) {
        const el = Array.from(node.getElementsByClassName('bx--file-close'))[0];
        el.addEventListener(
          'click',
          e => {
            this.props.resetUploaded();
          },
          false
        );
      }
    }
  };

  fileUploaderRef = (el: ?Object) => {
    // $FlowFixMe
    this.fileUploader = el;
  };

  render() {
    const { isOpen, isTooMany, parseError, isReady, isInvalid } = this.props;
    return (
      <Modal
        open={isOpen}
        onRequestClose={this.handleClose}
        modalHeading="Import Whitelist"
        passiveModal
        className="whitelist-import-modal"
      >
        <h4 className="pui-h4">
          Add multiple addresses to the whitelist by uploading a comma separated
          .CSV file. The format should be as follows:
          <br />• ETH Address (address to whitelist);
          <br />• Sell Restriction Date: <strong>mm/dd/yyyy</strong> (date when
          the resale restrictions should be lifted for that address);
          <br />
          Empty cell will be considered as permanent lockup.
          <br />• Buy Restriction Date: <strong> mm/dd/yyyy</strong> (date when
          the buy restrictions should be lifted for that address);
          <br />• KYC/AML Expiry Date: <strong>mm/dd/yyyy</strong>;<br />• Can
          buy from STO: set to <strong>"TRUE"</strong> to allow this address to
          purchase any number of tokens OR leave an empty cell to disable;
          <br />• Exempt From % Ownership: <strong>"TRUE"</strong> to enable OR
          empty cell to disable;
          <br />
          <br />
          If you have scheduled a USD Tiered STO, please include the additional
          fields:
          <br />• Is Accredited: Set to <strong>"TRUE"</strong> to mark the
          address as that of an accredited investor OR leave empty to mark the
          address as that of a non-accredited investor
          <br />• Non Accredited Limit: Set a maximum investment limit for that
          non-accredited investor's address or leave empty to use the default
          limit programmed in the STO
          <br />
          <br />
          Important:
          <br />
          Is Accredited and Non Accredited Limit will be ignored if you have not
          yet scheduled your USD Tiered STO. If you have scheduled your STO, all
          accredited/non-accredited investor information will be imported
          adequately. If you have not, you will be required to re-upload this
          information.
          <br />
          <br /> Maximum numbers of investors per transaction is{' '}
          <strong>75</strong>.
        </h4>
        <h5 className="pui-h5">
          You can&nbsp;&nbsp;&nbsp;
          <Icon name="download" fill="#252D6B" width="16" height="16" />
          &nbsp;
          <a href="/whitelist-sample.csv" className="pui-bold" download>
            Download Sample.csv
          </a>
          &nbsp;&nbsp;file and edit it.
        </h5>
        <FileUploader
          iconDescription="Cancel"
          buttonLabel="Upload File"
          onChange={this.handleUploaded}
          className="file-uploader"
          accept={['.csv']}
          buttonKind="secondary"
          filenameStatus="edit"
          ref={this.fileUploaderRef}
        />
        {parseError.length > 0 ? (
          <InlineNotification
            hideCloseButton
            title={parseError}
            subtitle="Please check instructions above and try again."
            kind="error"
          />
        ) : isInvalid && !isReady ? (
          <InlineNotification
            hideCloseButton
            title="The file you uploaded does not contain any valid values"
            subtitle="Please check instructions above and try again."
            kind="error"
          />
        ) : isTooMany ? (
          <InlineNotification
            hideCloseButton
            title="The file you uploaded contains more than 75 investors"
            subtitle="You can still continue, but only 75 first investors will be submitted."
            kind="error"
          />
        ) : (
          <div>
            <br />
            <Remark title="Reminder">
              Investors must be approved before they are added to the whitelist.
            </Remark>
          </div>
        )}
        <p align="right">
          <Button
            className="cancel-btn"
            kind="secondary"
            onClick={this.handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isReady || isInvalid}
            onClick={this.handleSubmit}
          >
            Import Whitelist
          </Button>
        </p>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportWhitelistModal);
