// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import semver from 'semver';
import { Remark, addressShortifier, confirm } from '@polymathnetwork/ui';
import {
  Icon,
  InlineNotification,
  FileUploader,
  Button,
} from 'carbon-components-react';

import {
  uploadCSV,
  mintTokens,
  mintResetUploaded,
} from '../../../actions/token';
import { fetch } from '../../../actions/sto';

import { STAGE_OVERVIEW } from '../../../reducers/sto';

import type { RootState } from '../../../redux/reducer';
import type { InvestorCSVRow } from '../../../actions/token';

type StateProps = {|
  isTooMany: boolean,
  isInvalidFormat: boolean,
  isReady: boolean,
  isInvalid: boolean,
  isTransfersPaused: Boolean,
  criticals: Array<InvestorCSVRow>,
  token: Object,
  pui: Object,
|};

type DispatchProps = {|
  fetch: () => any,
  uploadCSV: (file: Object) => any,
  mintTokens: () => any,
  mintResetUploaded: () => any,
  confirm: () => any,
|};

const mapStateToProps = (state: RootState): StateProps => ({
  isTooMany: state.token.mint.isTooMany,
  isInvalidFormat: state.token.mint.isInvalidFormat,
  isReady: state.token.mint.uploaded.length > 0,
  isInvalid: state.token.mint.criticals.length > 0,
  isTransfersPaused: state.whitelist.freezeStatus,
  criticals: state.token.mint.criticals,
  token: state.token,
  pui: state.pui,
  stage: state.sto.stage,
  version: state.token.token.contract.version,
});

const mapDispatchToProps = {
  fetch,
  uploadCSV,
  mintTokens,
  mintResetUploaded,
  confirm,
};

type Props = {||} & StateProps & DispatchProps;

class MintTokens extends Component<Props> {
  componentDidMount() {
    this.props.fetch();
  }

  handleReset = (withState = true) => {
    const node = this.fileUploader.nodes[0];
    if (node) {
      this.fileUploader.clearFiles();
      if (withState) {
        this.props.mintResetUploaded();
      }
    }
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
            this.props.mintResetUploaded();
          },
          false
        );
      }
    }
  };

  handleSubmit = () => {
    const { criticals } = this.props; // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
          Please confirm that all previous information is correct. Once you hit
          &laquo;CONFIRM&raquo;, data will be submitted to the blockchain. Any
          change will require that you start the process over. If you wish to
          review your information, please select &laquo;CANCEL&raquo;.
        </p>
        {criticals.length ? (
          <div>
            <InlineNotification
              hideCloseButton
              title={
                criticals.length +
                ' Error' +
                (criticals.length > 1 ? 's' : '') +
                ' in Your .csv File'
              }
              subtitle={
                'Please note that the entries below contains error, invalid expiry date, or duplicates another entry ' +
                'that prevent their content to be committed to the blockchain.' +
                'Entries were automatically deselected so they are not submitted ' +
                'to the blockchain. You can also elect to cancel the operation to review the csv file offline.'
              }
              kind="error"
            />
            <table className="import-criticals">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Address</th>
                  <th>Sale Lockup</th>
                  <th>Purchase Lockup</th>
                  <th>KYC/AML Expiry</th>
                  <th>Tokens</th>
                </tr>
              </thead>
              <tbody>
                {criticals.map(
                  ([
                    id,
                    address,
                    sale,
                    purchase,
                    expiry,
                    tokens,
                  ]: InvestorCSVRow) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{addressShortifier(address)}</td>
                      <td>{sale}</td>
                      <td>{purchase}</td>
                      <td>{expiry}</td>
                      <td>{tokens}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          ''
        )}
      </div>,
      () => {
        this.props.mintTokens();
        this.handleReset(false);
      },
      undefined,
      undefined,
      criticals.length > 0 ? 'mint-confirm-modal' : ''
    );
  };

  handleSkip = () => {
    // $FlowFixMe
    this.props.confirm(
      <div>
        <p>
          Note that manual minting will no longer be available once you schedule
          an offering (STO) for this token. All tokens sold during the offering
          will be minted as soon as the funds are received by the smart contract
          and according to the rate you will define when scheduling your STO.
          Your Token&apos;s total supply will therefore be:
        </p>
        <p>
          • Total number of tokens minted manually + total number of tokens sold
          during the STO.
          <br />• If you achieve 100% of your fundraise objective, the total
          number of tokens sold during the STO will be equal to your hard cap.
          <br />• If not, this number will be equal to the total number of
          tokens sold.
        </p>
        <p>
          Hit &laquo;CANCEL&raquo; if you would like to mint additional tokens
          or &laquo;CONFIRM&raquo; if you have minted all the tokens you needed
          to mint outside of the STO.
        </p>
      </div>,
      () => {
        this.props.pui.common.history.push(
          `/dashboard/${this.props.token.token.ticker}/sto`
        );
      },
      undefined,
      undefined,
      'pui-large-confirm-modal'
    );
  };

  fileUploaderRef = (el: ?Object) => {
    // $FlowFixMe
    this.fileUploader = el;
  };

  render() {
    const {
      isTooMany,
      isInvalidFormat,
      isReady,
      isInvalid,
      isTransfersPaused,
      criticals,
      stage,
      version,
    } = this.props;

    // NOTE: minting 3.x tokens is possible while an STO is in progress.
    const sto2xInProgress =
      stage === STAGE_OVERVIEW && semver.lt(version, '3.0.0');

    return (
      <div className="mint-tokens-wrapper">
        <div className="pui-page-box">
          <Remark title="Note">
            <span>
              Manual minting operations are disabled once an STO is configured
              and scheduled for your token.
              <br />
              This action will trigger multiple signing operations with your
              MetaMask wallet:
              <br />• One for the initial whitelist upload;
              <br />• One for the minting of tokens.
            </span>
          </Remark>
          <h2 className="pui-h2">Mint Your Tokens</h2>
          <h3 className="pui-h3">
            Your Security Token is now deployed to the blockchain.
            <br />
            As a next step, you may now elect to mint tokens for existing
            shareholders, affiliates or for your reserve.
          </h3>
          <br />
          <h4 className="pui-h4">
            Before you proceed, please check with your Advisor how your tokens
            should be distributed. Also, note that the ETH Addresses to which
            tokens are minted will be automatically added to the whitelist to
            allow for the tokens to be transferred.
          </h4>
          <h4 className="pui-h4">
            Enter the addresses and token quantities that need to be minted by
            uploading a comma separated .CSV file.
          </h4>
          <h4 className="pui-h4">
            The format of the file should be as follow:
            <br />• ETH Address (address to whitelist);
            <br />• Sell Restriction Date mm/dd/yyyy (date when the resale
            restrictions should be lifted for that address);
            <br />
            Empty cell will be considered as permanent lockup.
            <br />• Buy Restriction Date mm/dd/yyyy (date when the buy
            restrictions should be lifted for that address);
            <br />
            Empty cell will be considered as permanent lockup.
            <br />• KYC/AML Expiry Date mm/dd/yyyy;
            <br />• Number of tokens to mint for the ETH address (integer).
            <br />
            <Remark title="Note">
              Your file cannot exceed 40 addresses. If you have more than 40
              addresses on your whitelist, upload multiple files.
            </Remark>
          </h4>
          <h5 className="pui-h5">
            You can&nbsp;&nbsp;&nbsp;
            <Icon name="download" fill="#252D6B" width="16" height="16" />
            &nbsp;
            <a href="/mint-sample.csv" className="pui-bold" download>
              Download Sample.csv
            </a>
            &nbsp;&nbsp;file and edit it.
          </h5>
          {sto2xInProgress || isTransfersPaused ? (
            <InlineNotification
              hideCloseButton
              title="Minting is disabled"
              subtitle={`Sorry but you cannot mint tokens while ${
                isTransfersPaused
                  ? 'transfers are paused'
                  : 'STO is in progress'
              }.`}
              kind="error"
            />
          ) : (
            ''
          )}
          {criticals.length ? (
            <div>
              <InlineNotification
                hideCloseButton
                title={
                  criticals.length +
                  ' Error' +
                  (criticals.length > 1 ? 's' : '') +
                  ' in Your .csv File'
                }
                subtitle={
                  'Please note that the entries below contains error, invalid expiry date, or duplicates another entry ' +
                  'that prevent their content to be committed to the blockchain.' +
                  'Entries were automatically deselected so they are not submitted ' +
                  'to the blockchain. You can also elect to cancel the operation to review the csv file offline.' +
                  (
                    <ul>
                      {criticals.map(error => (
                        <li>{error}</li>
                      ))}
                    </ul>
                  )
                }
                kind="error"
              />
            </div>
          ) : (
            ''
          )}
          <FileUploader
            iconDescription="Cancel"
            buttonLabel="Upload File"
            onChange={this.handleUploaded}
            className={classNames('file-uploader', {
              disabled: sto2xInProgress || isTransfersPaused,
            })}
            accept={['.csv']}
            buttonKind="secondary"
            filenameStatus="edit"
            ref={this.fileUploaderRef}
            disabled={isTransfersPaused}
          />
          {isInvalidFormat ? (
            <InlineNotification
              hideCloseButton
              title="Improper file format"
              subtitle="Please export the information to CSV using a MS-DOS Comma Separated (.csv) file format and upload the new file"
              kind="error"
            />
          ) : isTooMany ? (
            <InlineNotification
              hideCloseButton
              title="The file you uploaded contains more than 40 addresses"
              subtitle="You can still continue, but only 40 first addresses will be submitted."
              kind="error"
            />
          ) : (
            ''
          )}
          <Button
            type="submit"
            disabled={
              !isReady || sto2xInProgress || isInvalidFormat || criticals.length
            }
            onClick={this.handleSubmit}
            style={{ marginTop: '10px' }}
            className="mint-token-btn"
          >
            Mint Tokens
          </Button>

          <Button
            type="submit"
            kind="secondary"
            disabled={sto2xInProgress}
            onClick={this.handleSkip}
            style={{ marginTop: '10px', marginLeft: '15px' }}
            className="skip-minting-btn"
          >
            SKIP MINTING
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MintTokens);
