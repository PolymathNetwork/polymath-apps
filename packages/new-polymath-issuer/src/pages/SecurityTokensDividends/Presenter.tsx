import React, { Component, Fragment } from 'react';
import { utils, formatters } from '@polymathnetwork/new-shared';
import {
  Page,
  Heading,
  Grid,
  Link,
  ButtonLarge,
  CardFeatureState,
  CardPrimary,
  icons,
} from '@polymathnetwork/new-ui';
import { ModalTransactionQueue } from '~/components';

export interface Props {
  onEnableDividends: () => void;
  dividendsModule?: { contractAddress: string };
}

export class Presenter extends Component<Props> {
  public handleEnableDividendsClick = () => {
    this.props.onEnableDividends();
  };

  public render() {
    const { dividendsModule } = this.props;

    return (
      <Page title="Dividends">
        <Heading variant="h1" as="h1">
          Dividends
        </Heading>
        <Grid.Row>
          <Grid.Col gridSpan={[12, 12, 7]}>
            <Heading variant="h4">
              Enable the Dividends module to distribute dividends to all token
              holders. Distribution events can be added, modified, enabled or
              disabled at any time. To distribute dividends to all your token
              holders, start by creating a dividend checkpoint. A dividend
              checkpoint will report the percentage ownership of security tokens
              per wallet address. This percentage will be used to calculate the
              amount of dividends owed to each wallet address.
            </Heading>
          </Grid.Col>
          <Grid.Col gridSpan={[12, 12, 5]}>
            <CardFeatureState
              status={dividendsModule ? 'idle' : 'inactive'}
              IconAsset={icons.SvgDividends}
            >
              <Heading color="primary" mt={2}>
                Ability to distribute Dividends
              </Heading>
              {dividendsModule ? (
                <Fragment>
                  <ButtonLarge kind="ghost" disabled>
                    Enabled
                  </ButtonLarge>
                  <CardPrimary>
                    Dividends contract address:
                    <Link
                      href={utils.toEtherscanUrl(
                        dividendsModule.contractAddress
                      )}
                    >
                      {formatters.toShortAddress(
                        dividendsModule.contractAddress
                      )}
                    </Link>
                  </CardPrimary>
                </Fragment>
              ) : (
                <ButtonLarge
                  kind="secondary"
                  onClick={this.handleEnableDividendsClick}
                >
                  Enable
                </ButtonLarge>
              )}
            </CardFeatureState>
          </Grid.Col>
        </Grid.Row>
        <ModalTransactionQueue />
      </Page>
    );
  }
}
