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
import { types } from '@polymathnetwork/new-shared';

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
}

export class Presenter extends Component<Props> {
  public state = {
    excludedWallets: null,
  };

  public setExcludedWallets = (excludedWallets: any) => {
    this.setState({ excludedWallets });
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

    switch (stepIndex) {
      case 1: {
        return (
          <Step2
            downloadTaxWithholdingList={downloadTaxWithholdingList}
            existingTaxWithholdings={taxWithholdings}
            updateTaxWithholdingList={updateTaxWithholdingList}
            onNextStep={onNextStep}
          />
        );
      }
      case 2: {
        return (
          <Step3
            excludedWallets={excludedWallets}
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
                      <Text as="strong">
                        {checkpoint.investorBalances.length}
                      </Text>{' '}
                      Investors held the token at checkpoint time
                    </Paragraph>
                  </Flex>
                  <Flex as="li">
                    <Flex flex="0" alignSelf="flex-start" mr="s">
                      <ListIcon />
                    </Flex>
                    <Paragraph color="baseText">
                      {/* NOTE: Mock data */}
                      <Text as="strong">0</Text> Investors are excluded from the
                      dividends distribution
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
                      {/* NOTE: Mock data */}
                      <Text as="strong">0</Text> Investors will receive
                      dividends
                    </Paragraph>
                  </Flex>
                </List>
              </Box>
              <Text as="strong" mt="m">
                Total Dividend Distribution
              </Text>
              <br />
              {/* NOTE: Mock data */}
              <Text fontSize={6}>0.00 -</Text>
            </CardPrimary>
          </GridRow.Col>
        </GridRow>
      </div>
    );
  }
}
