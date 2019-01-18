import React, { Component, Fragment } from 'react';
import { utils, formatters } from '@polymathnetwork/new-shared';
import {
  Page,
  Heading,
  Paragraph,
  GridRow,
  Link,
  ButtonLarge,
  CardFeatureState,
  CardPrimary,
  IconCircled,
  InlineFlex,
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
        <GridRow>
          <GridRow.Col gridSpan={{ sm: 12, lg: 7 }}>
            <Heading variant="h4">
              Enable the Dividends module to distribute dividends to all token
              holders. Distribution events can be added, modified, enabled or
              disabled at any time. To distribute dividends to all your token
              holders, start by creating a dividend checkpoint. A dividend
              checkpoint will report the percentage ownership of security tokens
              per wallet address. This percentage will be used to calculate the
              amount of dividends owed to each wallet address.
            </Heading>
          </GridRow.Col>
          <GridRow.Col gridSpan={{ sm: 12, lg: 5 }}>
            <CardFeatureState
              status={dividendsModule ? 'idle' : 'inactive'}
              IconAsset={icons.SvgDividendsOutline}
            >
              <Heading color="primary" mt={2}>
                Ability to distribute Dividends
              </Heading>
              {dividendsModule ? (
                <Fragment>
                  <Paragraph color="inactive">
                    <ButtonLarge kind="ghost" disabled>
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        width={16}
                        height={16}
                        bg="inactive"
                        color="white"
                        scale={0.9}
                      />
                      <InlineFlex ml="s">Enabled</InlineFlex>
                    </ButtonLarge>
                  </Paragraph>
                  <CardPrimary>
                    <Paragraph fontSize={0}>
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
                    </Paragraph>
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
          </GridRow.Col>
        </GridRow>
        <ModalTransactionQueue />
      </Page>
    );
  }
}
