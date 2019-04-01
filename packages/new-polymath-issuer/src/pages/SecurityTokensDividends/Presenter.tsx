import React, {
  FC,
  Fragment,
  useState,
  useCallback,
  createContext,
} from 'react';
import { utils, formatters, types } from '@polymathnetwork/new-shared';
import { validator } from '@polymathnetwork/new-ui';
import { validateYupSchema, yupToFormErrors } from 'formik';
import {
  Heading,
  Paragraph,
  Grid,
  GridRow,
  Link,
  LinkButton,
  Button,
  ButtonLarge,
  CardFeatureState,
  CardPrimary,
  Icon,
  IconCircled,
  icons,
  FormWrapper,
  FormItem,
  TextInput,
  BaseInput,
  ModalConfirm,
} from '@polymathnetwork/new-ui';
// import { BaseInput } from '@polymathnetwork/new-ui/src/components/inputs/BaseInput';
import { CheckpointList } from '~/components';
import { WalletAddress } from './WalletAddress';
import * as sc from './styles';

export const FilterCtx = createContext(['', '']);

export interface Props {
  onEnableDividends: (walletAddress: string) => void;
  onChangeWalletAddress: (walletAddress: string) => void;
  onCreateCheckpoint: () => void;
  dividendsModule?: types.Erc20DividendsModulePojo;
  userWalletAddress: string;
  subdomain?: string;
}

interface Values {
  walletAddress: string;
}

export const Presenter: FC<Props> = ({
  onEnableDividends,
  onCreateCheckpoint,
  onChangeWalletAddress,
  dividendsModule,
  userWalletAddress,
  subdomain,
}) => {
  const [walletAddress, setWalletAddress] = useState(
    dividendsModule ? dividendsModule.storageWalletAddress : userWalletAddress
  );
  const [isEditingAddress, setEditAddressState] = useState(false);

  const [searchName, setSearchName] = useState('');

  // useLayoutEffect(() => {
  //   console.log('field updated', searchName);
  // });

  const handleAddressModalOpen = useCallback(() => {
    setEditAddressState(true);
  }, []);

  const handleAddressModalClose = useCallback(() => {
    setEditAddressState(false);
  }, []);

  const handleEnableDividendsClick = useCallback(
    () => {
      onEnableDividends(walletAddress);
    },
    [walletAddress]
  );

  // const handleSearchChange = useCallback(values => {
  //   setSearchName(values.searchName);
  // }, []);

  const handleSearchChange = (e: any) => {
    setSearchName(e.target.value);
  };

  const handleAddressChange = useCallback(values => {
    if (dividendsModule) {
      onChangeWalletAddress(values.walletAddress);
    } else {
      setWalletAddress(values.walletAddress);
    }

    setEditAddressState(false);
  }, []);

  const handleAddressValidation = useCallback(async values => {
    const schema = validator.object().shape({
      walletAddress: validator
        .string()
        .required('An Address is required')
        .isEthereumAddress(),
    });

    try {
      await validateYupSchema(values, schema, true);
    } catch (err) {
      throw yupToFormErrors(err);
    }

    throw {};
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
          {dividendsModule ? (
            <Button iconPosition="right" onClick={onCreateCheckpoint}>
              Create dividend checkpoint
              <Icon
                Asset={icons.SvgPlusPlain}
                width={16}
                height={16}
                color="white"
              />
            </Button>
          ) : null}
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
                  <sc.DisabledModuleButton
                    variant="ghost"
                    iconPosition="left"
                    disabled
                  >
                    <IconCircled
                      Asset={icons.SvgCheckmark}
                      width={16}
                      height={16}
                      bg="inactive"
                      color="white"
                      scale={0.8}
                    />
                    Enabled
                  </sc.DisabledModuleButton>
                </Paragraph>
                <WalletAddress
                  walletAddress={
                    dividendsModule.storageWalletAddress || walletAddress
                  }
                  userWalletAddress={userWalletAddress}
                />
                <Paragraph mb="l">
                  <LinkButton onClick={handleAddressModalOpen}>
                    Edit address
                  </LinkButton>
                </Paragraph>
                <CardPrimary>
                  <Paragraph fontSize={0}>
                    Dividends contract address:{' '}
                    <Link
                      href={utils.toEtherscanUrl(dividendsModule.address, {
                        subdomain,
                        type: 'address',
                      })}
                    >
                      {formatters.toShortAddress(dividendsModule.address)}
                    </Link>
                  </Paragraph>
                </CardPrimary>
              </Fragment>
            ) : (
              <Fragment>
                <WalletAddress
                  walletAddress={walletAddress}
                  userWalletAddress={userWalletAddress}
                />
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
          {dividendsModule ? (
            <FilterCtx.Provider value={[searchName]}>
              <BaseInput
                name="search_text"
                onChange={handleSearchChange}
                value={searchName}
                placeholder="Search Text"
              />
              <CheckpointList
                securityTokenSymbol={dividendsModule.securityTokenSymbol}
              />
            </FilterCtx.Provider>
          ) : null}
        </GridRow.Col>
      </GridRow>
      <FormWrapper<Values>
        enableReinitialize
        initialValues={{
          walletAddress: dividendsModule
            ? dividendsModule.storageWalletAddress || walletAddress
            : walletAddress,
        }}
        onSubmit={handleAddressChange}
        validate={handleAddressValidation}
        render={({ handleSubmit, isValid }) => (
          <ModalConfirm
            isOpen={isEditingAddress}
            onSubmit={handleSubmit}
            onClose={handleAddressModalClose}
            isActionDisabled={!isValid}
            maxWidth={500}
          >
            <ModalConfirm.Header>
              Edit Wallet Address for Tax Withholdings
            </ModalConfirm.Header>
            <Paragraph fontSize={2}>
              Taxes will be withheld by the dividends smart contract at the time
              dividends are distributed. Withholdings can be subsequently
              withdrawn into a designated wallet for tax payments. Enter the
              address of the wallet designated to receive the tax withholdings
              funds when withdrawn.
            </Paragraph>
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
