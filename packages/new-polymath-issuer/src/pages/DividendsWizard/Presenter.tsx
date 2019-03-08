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

export interface Props {
  stepIndex: number;
  securityTokenSymbol: string;
  checkpoint: types.CheckpointEntity;
  onNextStep: () => void;
  taxWithholdings: types.TaxWithholdingEntity[];
  createDividendDistribution: (
    params: CreateDividendDistributionParams
  ) => void;
}

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
  public handleSubmit = (values: FormValues) => {
    const { createDividendDistribution } = this.props;

    // NOTE: FORMAT HERE
    console.log('SUBMITTING');

    createDividendDistribution(values);
  };

  public handleValidation = (value: FormValues) => {};

  public render() {
    const {
      stepIndex,
      securityTokenSymbol,
      checkpoint,
      onNextStep,
      taxWithholdings,
    } = this.props;
    return (
      <div>
        <Text color="primary">
          <ButtonLink
            variant="ghostSecondary"
            iconPosition="right"
            href={`/securityTokens/${securityTokenSymbol}/dividends`}
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
            <Form
              initialValues={{
                noWalletExcluded: false,
                isTaxWithholdingConfirmed: false,
                excludedWalletsCsv: null,
                taxWithholdingsCsv: null,
              }}
              validate={this.handleValidation}
              onSubmit={this.handleSubmit}
              render={formProps => {
                const StepComponent = getStepComponent(stepIndex);

                const commonProps = {
                  onSubmitStep: onNextStep,
                  taxWithholdings,
                  ...formProps,
                };

                return (
                  <form onSubmit={formProps.handleSubmit}>
                    <StepComponent {...commonProps} />
                  </form>
                );
              }}
            />
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
                </List>
              </Box>
              <Text as="strong" mt="m">
                Total Dividend Distribution
              </Text>
              <br />
              <Text fontSize={6}>0.00 -</Text>
            </CardPrimary>
          </GridRow.Col>
        </GridRow>
      </div>
    );
  }
}
