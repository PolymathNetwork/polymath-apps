import React, { ComponentType, Component } from 'react';
import {
  Box,
  Form,
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
import { CreateDividendDistributionParams, FormValues } from './Container';
import * as sc from './styles';
import { Step1 } from './Step-1';
import { Step2 } from './Step-2';
import { Step3 } from './Step-3';
import { types } from '@polymathnetwork/new-shared';
import { TaxWithholdingPojo } from '@polymathnetwork/new-shared/build/dist/typing/types';

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
  downloadTaxWithholdingList: (taxWithholdings: TaxWithholdingPojo[]) => void;
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
}

export interface State {
  excludedWalletsCsv: any;
}

const isStep1 = (
  StepComponent: typeof Step1 | typeof Step2 | typeof Step3,
  stepIndex: number
): StepComponent is typeof Step1 => stepIndex === 0;

const isStep2 = (
  StepComponent: typeof Step1 | typeof Step2 | typeof Step3,
  stepIndex: number
): StepComponent is typeof Step2 => stepIndex === 1;

const getStepComponent = (stepIndex: number) => {
  switch (stepIndex) {
    case 0: {
      return Step1;
    }
    case 1: {
      return Step2;
    }
    case 2: {
      return Step3;
    }
    default: {
      return Step1;
    }
  }
};

export class Presenter extends Component<Props> {
  public state = {
    excludedWalletsCsv: null,
  };

  public setExcludedWalletsCsv = (excludedWalletsCsv: any) => {
    this.setState({ excludedWalletsCsv });
  };

  public renderStepComponent = () => {
    const {
      stepIndex,
      onNextStep,
      taxWithholdings,
      downloadTaxWithholdingList,
      updateTaxWithholdingList,
    } = this.props;
    const { excludedWalletsCsv } = this.state;
    const StepComponent = getStepComponent(stepIndex);

    if (isStep1(StepComponent, stepIndex)) {
      return (
        <StepComponent
          onNextStep={onNextStep}
          excludedWalletsCsv={excludedWalletsCsv}
          setExcludedWalletsCsv={this.setExcludedWalletsCsv}
        />
      );
    }

    if (isStep2(StepComponent, stepIndex)) {
      return (
        <StepComponent
          downloadTaxWithholdingList={downloadTaxWithholdingList}
          existingTaxWithholdings={taxWithholdings}
          updateTaxWithholdingList={updateTaxWithholdingList}
          onNextStep={onNextStep}
        />
      );
    }

    return <StepComponent />;
  };

  public render() {
    const {
      stepIndex,
      securityTokenSymbol,
      checkpoint,
      onPreviousStep,
    } = this.props;

    const backLinkProps: {
      onClick?: () => void;
      href?: string;
    } = {};

    if (stepIndex === 0) {
      backLinkProps.href = `/securityTokens/${securityTokenSymbol}/dividends`;
    } else {
      backLinkProps.onClick = onPreviousStep;
    }

    return (
      <div>
        <Text color="primary">
          <ButtonLink
            variant="ghostSecondary"
            iconPosition="right"
            {...backLinkProps}
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
                      <ListIcon />
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
