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
import { Step3 } from './Step-3';
import { types, formatters } from '@polymathnetwork/new-shared';
import BigNumber from 'bignumber.js';
import { difference, intersection } from 'lodash';

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
}

export interface State {
  excludedWallets: null | ExclusionEntry[];
  dividendAmount: BigNumber;
  positiveWithholdingAmount: number;
}

export class Presenter extends Component<Props, State> {
  public state: State = {
    excludedWallets: null,
    dividendAmount: new BigNumber(0),
    positiveWithholdingAmount: this.props.taxWithholdings.filter(
      ({ percentage }) => percentage > 0
    ).length,
  };

  public setExcludedWallets = (excludedWallets: null | ExclusionEntry[]) => {
    this.setState({ excludedWallets });
  };

  public setDividendAmount = (dividendAmount: BigNumber) => {
    this.setState({ dividendAmount });
  };

  public setPositiveWithholdingAmount = (positiveWithholdingAmount: number) => {
    this.setState({ positiveWithholdingAmount });
  };

  public getExcludedAddresses = () => {
    const { excludedWallets } = this.state;

    return (excludedWallets || []).map(wallet =>
      wallet['Investor ETH Address'].toUpperCase()
    );
  };

  public getInvestorAddresses = () => {
    const {
      checkpoint: { investorBalances },
    } = this.props;

    return investorBalances.map(({ address }) => address.toUpperCase());
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
    } = this.props;
    const { excludedWallets } = this.state;
    const exclusionList = this.getExcludedAddresses();
    const nonExcludedInvestors = difference(
      this.getInvestorAddresses(),
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
          />
        );
      }
      case 2: {
        return (
          <Step3
            excludedWallets={excludedWallets}
            updateDividendAmount={this.setDividendAmount}
            createDividendDistribution={createDividendDistribution}
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

    const { dividendAmount, positiveWithholdingAmount } = this.state;
    const { investorBalances } = checkpoint;
    const exclusionList = this.getExcludedAddresses();
    const investors = this.getInvestorAddresses();
    const excludedInvestors = intersection(investors, exclusionList);
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
                onPreviousStep();
                event.preventDefault();
                event.stopPropagation();
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
                    <Paragraph>
                      <Text as="strong">{investorAmount}</Text> Investors held
                      the token at checkpoint time
                    </Paragraph>
                  </Flex>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon />
                    </Flex>
                    <Paragraph color="baseText">
                      <Text as="strong">{excludedAmount}</Text> Investors are
                      excluded from the dividends distribution
                    </Paragraph>
                  </Flex>
                </List>
                <Hr color="gray.2" />
                <List vertical>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon />
                    </Flex>
                    <Paragraph color="baseText">
                      <Text as="strong">{nonExcludedAmount}</Text> Investors
                      will receive dividends
                    </Paragraph>
                  </Flex>
                  {stepIndex > 0 && (
                    <Flex as="li">
                      <Flex flex="0" alignSelf="flex-start" mr="s">
                        <ListIcon />
                      </Flex>
                      <Paragraph color="baseText">
                        <Text as="strong">{positiveWithholdingAmount}</Text>{' '}
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
              <Text fontSize={6}>{formatters.toTokens(dividendAmount)} -</Text>
            </CardPrimary>
          </GridRow.Col>
        </GridRow>
      </div>
    );
  }
}
