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

import { STAGE_OVERVIEW } from '../../../reducers/sto';

import type { RootState } from '../../../redux/reducer';

type StateProps = {|
  isTooMany: boolean,
  parseError: String,
  isReady: boolean,
  isInvalid: boolean,
|};

type DispatchProps = {|
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
  uploadCSV,
  resetUploaded,
  addIndividualRestrictionMulti,
};

class ImportRestrictionsModal extends Component<Props> {
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
          Add multiple addresses to the list of individual trade restrictions by
          uploading a comma separated .CSV file. The format should be as follows
          (refer to sample .CSV below):
          <br />
          • ETH Address (address of tokenholder to be restricted)
          <br />
          • Daily restriction Start Date: mm/dd/yyyy (leave blank if no daily
          restriction being set)
          <br />
          &nbsp; -Daily restriction End Date: mm/dd/yyy (leave blank if no daily
          restriction being set)
          <br />
          &nbsp; -Daily Restriction type: <strong>0 or 1</strong> (0 if
          restriction will be in the form of # of tokens; 1 if restriction will
          be in the form of % of total supply of tokens)
          <br />
          &nbsp; -Daily volume of allowed tokens: if restriction in the form of
          % (1), input % value as a number between <strong>0.01 to 1</strong>.
          <br />
          • Custom restriction Start Date: mm/dd/yyyy (leave blank if no custom
          restriction being set)
          <br />
          • Custom restriction End Date: mm/dd/yyy (leave blank if no custom
          restriction being set)
          <br />• CustomRestriction type: <strong>0 or 1</strong> (0 if
          restriction will be in the form of # of tokens; 1 if restriction will
          be in the form of % of total supply of tokens)
          <br />
          &nbsp; -Custom volume of allowed tokens: if restriction in the form of
          % (1), input % value as a number between <strong>0.01 to 1</strong>.
          <br />
          &nbsp; -Rolling Period in Days: # of days the limit is in place before
          resetting (leave blank if you are only setting a daily restriction)
          <br />
          {/* <strong>You may add up to 40 addresses per .CSV file</strong>. The
          format should be as follows:
          <br />• ETH Address (address to volume restrict);
          <br />• 24h Start Date: <strong>mm/dd/yyyy</strong> (date when the
          volume restrictions will start for that address);
          <br />• 24h End Date: <strong> mm/dd/yyyy</strong> (date when the
          volume restrictions will end for that address);
          <br />• 24h Restriction Type: <strong>0 or 1</strong>;<br />• Whether
          the allowed tokens will be a percentage of all tokens or a fix value.
          Set to <strong>1</strong> for percentage.
          <br />• 24h Allowed Tokens: <strong>0.01 to 1</strong> when{' '}
          <strong>Restriction Type is 1</strong>
          <br />• Custom Start Date: <strong>mm/dd/yyyy</strong> (date when the
          volume restrictions will start for that address);
          <br />• Custom End Date: <strong> mm/dd/yyyy</strong> (date when the
          volume restrictions will end for that address);
          <br />• Custom Restriction Type: <strong>0 or 1</strong>;<br />•
          Whether the allowed tokens will be a percentage of all tokens or a fix
          value. Set to <strong>1</strong> for percentage.
          <br />• Custom Allowed Tokens: <strong>0.01 to 1</strong> when{' '}
          <strong>Restriction Type is 1</strong>
          <br />• Rolling Period In Days: <strong>Numerical Value</strong> how
          many days the limit is in place before resetting
          <br />
          <br /> */}
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
            Default start and end times for restrictions is 12:00am. To change
            the start and end time for an individual restriction, click on the
            address line in the table after upload.
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
              Import Individual Restrictions
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
