import React, { FC, Fragment, useState, useCallback } from 'react';
import { utils, formatters, types } from '@polymathnetwork/new-shared';
import {
  Heading,
  Paragraph,
  Grid,
  GridRow,
  Link,
  LinkButton,
  Label,
  Button,
  ButtonLarge,
  CardFeatureState,
  CardPrimary,
  Icon,
  IconCircled,
  icons,
  Form,
  FormItem,
  TextInput,
  ModalConfirm,
} from '@polymathnetwork/new-ui';
import { Checkpoints } from '~/components';

export interface Props {
  onEnableDividends: (walletAddress: string) => void;
  onCreateCheckpoint: () => void;
  dividendsModule?: types.Erc20DividendsModulePojo;
  defaultWalletAddress: string;
}

export const Presenter: FC<Props> = ({
  onEnableDividends,
  onCreateCheckpoint,
  dividendsModule,
  defaultWalletAddress,
}) => {
  const [walletAddress, setWalletAddress] = useState(defaultWalletAddress);
  const [isEditingAddress, setEditAddressState] = useState(false);

  const handleAddressModalOpen = useCallback(() => {
    setEditAddressState(true);
  }, []);

  const handleAddressModalClose = useCallback(() => {
    setEditAddressState(false);
  }, []);

  const handleEnableDividendsClick = useCallback(() => {
    onEnableDividends(walletAddress);
  }, []);

  const handleAddressChange = useCallback(values => {
    setWalletAddress(values.walletAddress);
    setEditAddressState(false);
  }, []);

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
          <Button iconPosition="right" onClick={onCreateCheckpoint}>
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
                    Dividends contract address:{' '}
                    <Link href={utils.toEtherscanUrl(dividendsModule.address)}>
                      {formatters.toShortAddress(dividendsModule.address)}
                    </Link>
                  </Paragraph>
                </CardPrimary>
              </Fragment>
            ) : (
              <Fragment>
                <Paragraph bold color="highlightText" mb={1}>
                  Wallet Address to Receive Tax Withholdings
                </Paragraph>
                <Paragraph mb={1}>
                  {formatters.toShortAddress(walletAddress, { size: 26 })}
                  <br />
                  {walletAddress === defaultWalletAddress && (
                    <Label color="baseText" bg="gray.1">
                      Current Wallet Address
                    </Label>
                  )}
                </Paragraph>
                <Paragraph mb="l">
                  <LinkButton onClick={handleAddressModalOpen}>
                    Edit address
                  </LinkButton>
                </Paragraph>
                <ButtonLarge
                  variant="secondary"
                  onClick={handleEnableDividendsClick}
                >
                  Enable
                </ButtonLarge>
              </Fragment>
            )}
          </CardFeatureState>
        </GridRow.Col>
        <GridRow.Col gridSpan={12}>
          <Checkpoints symbol="A0T0" />
        </GridRow.Col>
      </GridRow>
      <Form
        initialValues={{
          walletAddress,
        }}
        onSubmit={handleAddressChange}
        render={({ handleSubmit }) => (
          <ModalConfirm
            isOpen={isEditingAddress && !dividendsModule}
            onSubmit={handleSubmit}
            onClose={handleAddressModalClose}
          >
            <ModalConfirm.Header>
              Wallet Address to Receive Tax Withholdings
            </ModalConfirm.Header>
            <Heading variant="h4">
              This is the explanation of what is going on here.
            </Heading>
            <Grid>
              <FormItem name="walletAddress">
                <FormItem.Label>Wallet Address</FormItem.Label>
                <FormItem.Input
                  component={TextInput}
                  placeholder="Wallet address"
                />
                <FormItem.Error />
              </FormItem>
            </Grid>
          </ModalConfirm>
        )}
      />
    </Fragment>
  );
};
