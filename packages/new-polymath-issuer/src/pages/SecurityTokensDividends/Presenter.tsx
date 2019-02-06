import React, { Component, Fragment } from 'react';
import { utils, formatters, types } from '@polymathnetwork/new-shared';
import {
  Heading,
  Paragraph,
  GridRow,
  Link,
  Button,
  ButtonLarge,
  CardFeatureState,
  CardPrimary,
  Icon,
  IconCircled,
  icons,
} from '@polymathnetwork/new-ui';
import { ModalTransactionQueue, Checkpoints } from '~/components';

export interface Props {
  onEnableDividends: () => void;
  onCreateCheckpoint: () => void;
  dividendsModule?: types.Erc20DividendsModulePojo;
}

export class Presenter extends Component<Props> {
  public handleEnableDividendsClick = () => {
    this.props.onEnableDividends();
  };

  public handleCreateCheckpointClick = () => {
    this.props.onCreateCheckpoint();
  };

  public render() {
    const { dividendsModule } = this.props;

    return (
      <Fragment>
        <Heading variant="h1" as="h1">
          Dividends
        </Heading>
        <GridRow>
          <GridRow.Col gridSpan={{ sm: 12, lg: 7 }}>
            <Heading variant="h4" mb="l">
              Enable the Dividends module to distribute dividends to all token
              holders. Distribution events can be added, modified, enabled or
              disabled at any time. To distribute dividends to all your token
              holders, start by creating a dividend checkpoint. A dividend
              checkpoint will report the percentage ownership of security tokens
              per wallet address. This percentage will be used to calculate the
              amount of dividends owed to each wallet address.
            </Heading>
            <Button
              iconPosition="right"
              onClick={this.handleCreateCheckpointClick}
            >
              Create dividend checkpoint
              <Icon
                Asset={icons.SvgPlusPlain}
                width={16}
                height={16}
                color="white"
              />
            </Button>
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
                    <ButtonLarge variant="ghost" iconPosition="left" disabled>
                      <IconCircled
                        Asset={icons.SvgCheckmark}
                        width={16}
                        height={16}
                        bg="inactive"
                        color="white"
                        scale={0.9}
                      />
                      Enabled
                    </ButtonLarge>
                  </Paragraph>
                  <CardPrimary>
                    <Paragraph fontSize={0}>
                      Dividends contract address:
                      <Link
                        href={utils.toEtherscanUrl(dividendsModule.address)}
                      >
                        {formatters.toShortAddress(dividendsModule.address)}
                      </Link>
                    </Paragraph>
                  </CardPrimary>
                </Fragment>
              ) : (
                <ButtonLarge
                  variant="secondary"
                  onClick={this.handleEnableDividendsClick}
                >
                  Enable
                </ButtonLarge>
              )}
            </CardFeatureState>
          </GridRow.Col>
          <GridRow.Col gridSpan={12}>
            <Checkpoints symbol="A0T0" />
          </GridRow.Col>
        </GridRow>
        <ModalTransactionQueue />
      </Fragment>
    );
  }
}
