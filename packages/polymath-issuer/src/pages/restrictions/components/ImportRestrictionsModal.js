import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Icon,
  FileUploader,
  Button,
  InlineNotification,
} from 'carbon-components-react';
import { Modal, Remark, Paragraph } from '@polymathnetwork/ui';
import {
  uploadCSV,
  resetUploaded,
  addIndividualRestrictionMulti,
} from '../../../actions/restrictions';

import { fetch } from '../../../actions/sto';
import { STAGE_OVERVIEW } from '../../../reducers/sto';

import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  isTooMany: boolean,
  parseError: String,
  isReady: boolean,
  isInvalid: boolean,
|};

type DispatchProps = {|
  fetch: () => any,
  addIndividualRestrictionMulti: () => any,
  uploadCSV: (file: Object) => any,
  resetUploaded: () => any,
|};

type Props = {|
  isOpen: boolean,
  onClose: () => any,
  onSubmit: (file: ?Object) => any,
|} & StateProps &
  DispatchProps;

const mapStateToProps = state => ({
  isTooMany: state.restrictions.isTooMany,
  parseError: state.restrictions.parseError,
  isReady: state.restrictions.uploaded.length > 0,
  isInvalid: state.restrictions.criticals.length > 0,
  sto: state.sto,
});

const mapDispatchToProps = {
  fetch,
  uploadCSV,
  resetUploaded,
  addIndividualRestrictionMulti,
};

class ImportRestrictionsModal extends Component<Props> {
  componentDidMount() {
    this.props.fetch();
  }

  handleClose = () => {
    this.fileUploader.clearFiles();
    this.props.resetUploaded();
    this.props.onClose();
  };

  handleSubmit = () => {
    this.handleClose();
    this.props.addIndividualRestrictionMulti();
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
    const {
      isOpen,
      sto,
      isTooMany,
      parseError,
      isReady,
      isInvalid,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onClose={this.handleClose}
        className="whitelist-import-modal"
      >
        <Modal.Header>Import Whitelist</Modal.Header>
        <h4 className="pui-h4">
          Add multiple addresses to the whitelist by uploading a comma separated
          .CSV file.{' '}
          <strong>You may add up to 40 addresses per .CSV file</strong>. The
          format should be as follows:
          <br />• ETH Address (address to volume restrict);
          <br />• 24h Start Date: <strong>mm/dd/yyyy</strong> (date when the
          volume restrictions will start for that address);
          <br />• 24h End Date: <strong> mm/dd/yyyy</strong> (date when the
          volume restrictions will end for that address);
          <br />• 24h Restriction Type: <strong>0 or 1</strong>;<br />• Whether
          the allowed tokens will be a percentage of all tokens or a fix value.
          Set to <strong>1</strong> for percentage.
          <br />• 24h Allowed Tokens: <strong>0 to 100</strong> when{' '}
          <strong>Restriction Type is 1</strong>
          <br />
          <br />
        </h4>
        <h5 className="pui-h5">
          You can&nbsp;&nbsp;&nbsp;
          <Icon name="download" fill="#252D6B" width="16" height="16" />
          &nbsp;
          <a href="/restrictions-sample.csv" className="pui-bold" download>
            Download Sample.csv
          </a>
          &nbsp;&nbsp;file and edit it.
        </h5>
        <FileUploader
          iconDescription="Cancel"
          multiple={false}
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
        ) : isInvalid ? (
          <InlineNotification
            hideCloseButton
            title="The file you uploaded has invalid fields"
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
            title="The file you uploaded contains more than 40 investors"
            subtitle="You can still continue, but only 40 first investors will be submitted."
            kind="error"
          />
        ) : (
          <Remark title="Reminder">
            Investors must be approved before they are added to the whitelist.{' '}
            <br />
            Your file cannot exceed 40 addresses. If you have more than 40
            addresses on your whitelist, upload multiple files.
          </Remark>
        )}
        <Modal.Footer>
          <Paragraph align="right">
            <Button
              className="cancel-btn"
              kind="secondary"
              onClick={this.handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              kind="primary"
              disabled={!isReady || isInvalid}
              onClick={this.handleSubmit}
            >
              Import Whitelist
            </Button>
          </Paragraph>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportRestrictionsModal);
