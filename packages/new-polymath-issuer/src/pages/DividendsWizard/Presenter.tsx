import React, { Component } from 'react';
import {
  Box,
  Icon,
  icons,
  Heading,
  GridRow,
  Paragraph,
  List,
  Hr,
  Flex,
  Text,
  ProgressIndicator,
  CardPrimary,
  ButtonLink,
} from '@polymathnetwork/new-ui';
import { ListIcon } from '~/components/ListIcon';
import { CreateDividendDistributionParams } from './Container';
import * as sc from './styles';
import { Step1 } from './Step-1';
import { Step2 } from './Step-2';
import { ConfirmModal } from './Step-2/ConfirmModal';
import { Step3 } from './Step-3';
import { types, formatters } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { difference, intersection } from 'lodash';
import {
  GetErc20BalanceByAddressAndWalletArgs,
  GetIsValidErc20ByAddressArgs,
} from '~/types';

export interface ExclusionEntry {
  ['Investor ETH Address']: string;
}

export interface Props {
  stepIndex: number;
  securityTokenSymbol: string;
  checkpoint: types.CheckpointEntity;
  onNextStep: () => void;
  onPreviousStep: () => void;
  updateTaxWithholdingList: (
    values: Array<{
      investorAddress: string;
      percentage: number;
    }>
  ) => void;
  taxWithholdings: types.TaxWithholdingEntity[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingEntity[]
  ) => void;
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
  downloadSampleExclusionList: () => void;
  fetchBalance: (
    args: GetErc20BalanceByAddressAndWalletArgs
  ) => Promise<types.Erc20TokenBalancePojo>;
  fetchIsValidToken: (args: GetIsValidErc20ByAddressArgs) => Promise<boolean>;
  isLoadingData: boolean;
}

export interface State {
  excludedWallets: null | ExclusionEntry[];
  dividendAmount: BigNumber;
  tokenSymbol: string;
  positiveWithholdingAmount: number;
  isDirty: boolean;
  confirmModalOpen: boolean;
}

export class Presenter extends Component<Props, State> {
  public state: State = {
    excludedWallets: null,
    dividendAmount: new BigNumber(0),
    tokenSymbol: '-',
    positiveWithholdingAmount: this.props.taxWithholdings.filter(
      ({ percentage }) => percentage > 0
    ).length,
    isDirty: false,
    confirmModalOpen: false,
  };

  public setExcludedWallets = (excludedWallets: null | ExclusionEntry[]) => {
    this.setState({ excludedWallets });
  };

  public setDividendAmount = (dividendAmount: BigNumber) => {
    this.setState({ dividendAmount });
  };

  public setTokenSymbol = (tokenSymbol: string) => {
    this.setState({ tokenSymbol });
  };

  public setPositiveWithholdingAmount = (positiveWithholdingAmount: number) => {
    this.setState({ positiveWithholdingAmount });
  };

  public setIsDirty = (isDirty: boolean) => {
    if (isDirty !== this.state.isDirty) {
      this.setState({ isDirty });
    }
  };

  public closeConfirmModal = () => {
    this.setState({ confirmModalOpen: false });
  };

  public openConfirmModal = () => {
    this.setState({ confirmModalOpen: true });
  };

  public onConfirmBack = () => {
    this.closeConfirmModal();
    this.props.onPreviousStep();
  };

  public getExcludedAddresses = () => {
    const { excludedWallets } = this.state;

    return (excludedWallets || []).map(wallet =>
      wallet['Investor ETH Address'].toUpperCase()
    );
  };

  public getTokenHolderAddresses = () => {
    const {
      checkpoint: { investorBalances },
    } = this.props;

    const tokenHolders = investorBalances.filter(({ balance }) =>
      balance.gt(0)
    );

    return tokenHolders.map(({ address }) => address.toUpperCase());
  };

  public renderStepComponent = () => {
    const {
      stepIndex,
      onNextStep,
      taxWithholdings,
      downloadTaxWithholdingList,
      createDividendDistribution,
      downloadSampleExclusionList,
      updateTaxWithholdingList,
      fetchBalance,
      fetchIsValidToken,
      securityTokenSymbol,
      isLoadingData,
    } = this.props;
    const { excludedWallets } = this.state;
    const exclusionList = this.getExcludedAddresses();
    const nonExcludedInvestors = difference(
      this.getTokenHolderAddresses(),
      exclusionList
    );

    switch (stepIndex) {
      case 1: {
        return (
          <Step2
            downloadTaxWithholdingList={downloadTaxWithholdingList}
            existingTaxWithholdings={taxWithholdings}
            updateTaxWithholdingList={updateTaxWithholdingList}
            onNextStep={onNextStep}
            onTaxWithholdingListChange={this.setPositiveWithholdingAmount}
            nonExcludedInvestors={nonExcludedInvestors}
            exclusionList={exclusionList}
            isLoadingData={isLoadingData}
            setIsDirty={this.setIsDirty}
          />
        );
      }
      case 2: {
        return (
          <Step3
            excludedWallets={excludedWallets}
            updateDividendAmount={this.setDividendAmount}
            updateCurrencySymbol={this.setTokenSymbol}
            createDividendDistribution={createDividendDistribution}
            fetchBalance={fetchBalance}
            fetchIsValidToken={fetchIsValidToken}
            securityTokenSymbol={securityTokenSymbol}
          />
        );
      }
      case 0:
      default: {
        return (
          <Step1
            downloadSampleExclusionList={downloadSampleExclusionList}
            onNextStep={onNextStep}
            excludedWallets={excludedWallets}
            setExcludedWallets={this.setExcludedWallets}
          />
        );
      }
    }
  };

  public render() {
    const {
      stepIndex,
      securityTokenSymbol,
      checkpoint,
      onPreviousStep,
    } = this.props;

    const {
      dividendAmount,
      tokenSymbol,
      positiveWithholdingAmount,
      confirmModalOpen,
    } = this.state;
    const { investorBalances } = checkpoint;
    const exclusionList = this.getExcludedAddresses();
    const tokenHolders = this.getTokenHolderAddresses();
    const excludedInvestors = intersection(tokenHolders, exclusionList);
    const excludedAmount = excludedInvestors.length;
    const investorAmount = investorBalances.length;
    const nonExcludedAmount = investorAmount - excludedAmount;

    return (
      <div>
        <Text color="primary">
          <ButtonLink
            variant="ghostSecondary"
            iconPosition="right"
            href={`/securityTokens/${securityTokenSymbol}/dividends`}
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>
            ) => {
              // TODO @RafaelVidaurre: Fix this by using the right component
              if (stepIndex > 0) {
                event.preventDefault();
                event.stopPropagation();
                if (this.state.isDirty) {
                  this.openConfirmModal();
                } else {
                  onPreviousStep();
                }
              }
            }}
          >
            Go back
            <Icon Asset={icons.SvgArrow} width={18} height={18} />
          </ButtonLink>
        </Text>
        <Heading variant="h1" as="h1">
          Create New Dividend Distribution
        </Heading>
        <GridRow>
          <GridRow.Col gridSpan={{ sm: 12, lg: 8 }}>
            {this.renderStepComponent()}
          </GridRow.Col>
          <GridRow.Col gridSpan={{ sm: 12, lg: 4 }}>
            <Box height={250} mb="xl">
              <sc.WizardProgress currentIndex={stepIndex} vertical ordered>
                <ProgressIndicator.Step label="Dividends Exclusion List" />
                <ProgressIndicator.Step label="Tax Withholdings List" />
                <ProgressIndicator.Step label="Dividends Distribution Parameters" />
              </sc.WizardProgress>
            </Box>
            <CardPrimary as="section" p="m">
              <Heading variant="h3" mb="l">
                New Dividends Distribution
              </Heading>
              <Box mb="l">
                <List vertical>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon />
                    </Flex>
                    <Paragraph color="baseText">
                      <Text as="strong" color="highlightText">
                        {investorAmount}
                      </Text>{' '}
                      Investors held the token at checkpoint time
                    </Paragraph>
                  </Flex>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon />
                    </Flex>
                    <Paragraph color="baseText">
                      <Text as="strong" color="highlightText">
                        {excludedAmount}
                      </Text>{' '}
                      Investors are excluded from the dividends distribution
                    </Paragraph>
                  </Flex>
                </List>
                <Hr color="gray.2" />
                <List vertical>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon active />
                    </Flex>
                    <Paragraph color="baseText">
                      <Text as="strong" color="highlightText">
                        {nonExcludedAmount}
                      </Text>{' '}
                      Investors will receive dividends
                    </Paragraph>
                  </Flex>
                  {stepIndex > 0 && (
                    <Flex as="li">
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph color="baseText">
                        <Text as="strong" color="highlightText">
                          {positiveWithholdingAmount}
                        </Text>{' '}
                        Investors will have their taxes withheld
                      </Paragraph>
                    </Flex>
                  )}
                </List>
              </Box>
              <Text as="strong" mt="m">
                Total Dividend Distribution
              </Text>
              <br />
              <Text fontSize={6}>
                {formatters.toTokens(dividendAmount)} {tokenSymbol}
              </Text>
            </CardPrimary>
          </GridRow.Col>
        </GridRow>
        <ConfirmModal
          isOpen={confirmModalOpen}
          onConfirm={this.onConfirmBack}
          onClose={this.closeConfirmModal}
        />
      </div>
    );
  }
}
