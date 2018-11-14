// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { RootState } from '../redux/reducer';
import DocumentTitle from 'react-document-title';
import {
  Accordion,
  AccordionItem,
  Button,
  Loading,
} from 'carbon-components-react';
import Contract from '@polymathnetwork/js';
import * as ui from '@polymathnetwork/ui';
import LegacySTArtifact from '../utils/legacy-artifacts/LegacySecurityToken.json';
import { fetchLegacyToken } from '../actions/token';

type StateProps = {|
  legacyToken: ?{|
    address: string,
    ticker: string,
  |},
  account: ?string,
|};

type State = {|
  loading: boolean,
  tokenIsFrozen: boolean,
|};

type Props = {|
  dispatch: Function,
|} & StateProps;

const mapStateToProps = (state: RootState): StateProps => ({
  legacyToken: state.token.legacyToken,
  account: state.network.account,
});

class MigrateTokenPageContainer extends Component<Props, State> {
  state = {
    loading: true,
    tokenIsFrozen: true,
  };

  async getFrozenStatus() {
    const { legacyToken } = this.props;
    if (!legacyToken) {
      return;
    }
    const legacySecurityToken = new Contract(
      LegacySTArtifact,
      legacyToken.address
    );
    try {
      const tokenIsFrozen = await legacySecurityToken._contractWS.methods
        .freeze()
        .call();

      /**
       * NOTE @monitz87: this prevents an infinite loop when the component is updated
       */
      if (
        this.state.tokenIsFrozen !== tokenIsFrozen ||
        this.state.loading === true
      ) {
        this.setState({
          loading: false,
          tokenIsFrozen,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount() {
    this.getFrozenStatus();
  }

  componentDidUpdate() {
    this.getFrozenStatus();
  }

  handleClick = (event: Object) => {
    const { dispatch, legacyToken } = this.props;
    const { tokenIsFrozen } = this.state;

    if (!legacyToken) {
      return;
    }

    const ticker = legacyToken.ticker.toUpperCase();

    const legacySecurityToken = new Contract(
      LegacySTArtifact,
      legacyToken.address
    );

    const titles = ['Renouncing Ownership'];

    if (!tokenIsFrozen) {
      titles.unshift('Freezing Transfers');
    }

    dispatch(
      ui.confirm(
        <div>
          <p>
            Completion of your {ticker} token version update will require{' '}
            {tokenIsFrozen ? 'one' : 'two'} wallet transaction
            {tokenIsFrozen ? '' : 's'}.
          </p>
          {tokenIsFrozen ? null : (
            <p>
              • The first transaction will be used to freeze transactions on the
              token.
            </p>
          )}
          <p>
            • The {tokenIsFrozen ? '' : 'second '}
            transaction will be used to renounce ownership of the token.
          </p>
        </div>,
        async () => {
          dispatch(
            ui.tx(
              titles,
              async () => {
                try {
                  if (!tokenIsFrozen) {
                    await legacySecurityToken._tx(
                      legacySecurityToken._methods.freezeTransfers(),
                      null,
                      1.15
                    );
                  }

                  await legacySecurityToken._tx(
                    legacySecurityToken._methods.renounceOwnership(),
                    null,
                    1.15
                  );
                } catch (err) {
                  dispatch(fetchLegacyToken(ticker));
                  throw err;
                }
              },
              'Token Migrated Successfully',
              async () => {
                await dispatch(fetchLegacyToken(ticker));
              },
              undefined,
              undefined,
              true,
              `Proceeding with the ${ticker} Token Version Update`
            )
          );
        }
      )
    );
  };

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <MigrateTokenPage handleClick={this.handleClick} />
    );
  }
}

class MigrateTokenPage extends Component<{| handleClick: Function |}> {
  render() {
    return (
      <DocumentTitle title="Migrate your Token – Polymath">
        <div className="pui-single-box">
          <div className="pui-single-box-header">
            <div className="pui-single-box-new-version-bull">
              <img src="/2.0-logo.svg" alt="Bull" />
            </div>
            <h1 className="pui-h1">Polymath v2.0 is Released!</h1>
            <h3 className="pui-h2">
              To Continue using this Application, Please Migrate your Security
              Token to the New Release
            </h3>
            <div className="pui-clearfix" />
          </div>
          <h3 className="pui-h4">
            On 11/22 we released Polymath v2.0, which includes exciting new
            features for your tokens. In particular, we have added "Forced
            Transfer" which allows an authorized wallet (multi-sig recommended)
            to transfer security tokens out of a wallet to which they do not
            have the private key. This functionality can be used to address loss
            of private key or other legal actions.
          </h3>
          <h3 className="pui-h4">
            At Polymath, our goal is to make security token upgrades as simple
            and seamless as possible. Unfortunately, the upgrade to v2.0 one is
            not compatible with the current version of your token. You don't
            need to worry about it though, as we have prepared a simple 2-step
            process for you to migrate from your v1.3.0 to your v2.0.0 security
            tokens.
          </h3>
          <h3 className="pui-h4">
            To prepare the migration we have already deployed a new v2.0 version
            of your token and transferred the same number of new tokens to each
            of your respective existing token holders. You can view details of
            your new token here.
          </h3>
          <h3 className="pui-h4">
            To complete the migration you will need to freeze your existing
            tokens and renounce ownership since they will no longer be in use.
            Please click on the Start Migration button to begin this process.
          </h3>
          <Button onClick={this.props.handleClick}>Start Migration</Button>

          <Accordion className="pui-metamask-accordion">
            <AccordionItem title="What other features were added to v2.0.0?">
              <ul>
                <li>1) Pegged to Fiat Security Token Offerings</li>
                <li>2) Forced Transfer</li>
                <li>3) Tax Witholding and Address Exclusion on Dividends</li>
              </ul>
            </AccordionItem>
            <AccordionItem title="What is the cost impact of this migration to me?">
              <p>
                The cost of this migration is the gas fee required to complete
                the simple 2-step process to migrate your tokens from v1.3.0 to
                v2.0.0. The cost of creating the security token will be borne by
                Polymath.
              </p>
            </AccordionItem>
            <AccordionItem title="What benefits would I get by moving to v2.0.0?">
              <p>
                Compliance: Support for Forced Transfer allows you to seamlessly
                perform token re-issuance without any impact on total supply.
                This functionality also provides you with the tools necessary to
                comply with legal actions (token split between multiple
                accounts, etc.) Powerful fundraise tool: v2.0.0 introduces a new
                full featured STO that allows you to define multiple pricing
                tiers, minimum investments (for all investors) and maximum
                investment (for retail investors and based on their
                jurisdiction).This STO also introduces support for the DAI
                stable coin. Simplified Dividends Distribution: Once your token
                is distributed, v2.0.0 allows you to perform dividends
                distribution including tax withholdings based on each individual
                token holder's jurisdiction.
              </p>
            </AccordionItem>
            <AccordionItem title="What happens if I do not upgrade?">
              <p>
                If you don't upgrade you can continue to use your existing
                security token, but you will no longer be able to use our dApp.
                Additionally, new modules that are not compatible with earlier
                token versions may be developed, and your token will not be able
                to incorporate them.
              </p>
            </AccordionItem>
            <AccordionItem title="Will all new upgrades require my tokens to be redistributed?">
              <p>
                Part of this release includes built in upgradability for future
                upgrades not to require token migrations. However, while we will
                always endeavour to avoid token re-issuance, new upgrades may,
                from time to time require a token redistribution. Contrary to
                this upgrade, subsequent ones will provide you with the option
                to continue using a version of our dApp without upgrading your
                security token.
              </p>
            </AccordionItem>
            <AccordionItem title="Where can I find the full release notes for v2.0.0?">
              <p>INSERT MEDIUM ARTICLE LINK</p>
            </AccordionItem>
          </Accordion>
        </div>
      </DocumentTitle>
    );
  }
}

export { MigrateTokenPage };
export default connect(mapStateToProps)(MigrateTokenPageContainer);
