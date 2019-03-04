import React from 'react';
import {
  Box,
  Button,
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
  IconCircled,
} from '@polymathnetwork/new-ui';
import * as sc from './styles';
import { Step1 } from './Step-1';

export interface Props {
  stepIndex: number;
  onNextStep: () => void;
}

const getStep = (stepIndex: number) => {
  switch (stepIndex) {
    case 0: {
      return Step1;
    }
    default: {
      return Step1;
    }
    // case 1:
    //   return <Step2 />;
    // case 2:
    //   return <Step3 />;
  }
};

export const Presenter = ({ stepIndex, onNextStep }: Props) => (
  <div>
    <Text color="primary">
      <Button variant="ghostSecondary" iconPosition="right">
        Go back
        <Icon Asset={icons.SvgArrow} width={18} height={18} />
      </Button>
    </Text>
    <Heading variant="h1" as="h1">
      Create New Dividend Distribution
    </Heading>
    <GridRow>
      <GridRow.Col gridSpan={{ sm: 12, lg: 8 }}>
        <Form
          initialValues={{
            noWalletExcluded: false,
            excludedWalletsCsv: null,
          }}
          onSubmit={() => {}}
          render={props => {
            const Step = getStep(stepIndex);

            return <Step {...props} onSubmitStep={onNextStep} />;
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
                  <IconCircled
                    Asset={icons.SvgCheckmark}
                    bg="inactive"
                    color="gray.1"
                    width={24}
                    height={24}
                    scale={0.9}
                  />
                </Flex>
                <Paragraph>
                  <Text as="strong">1400</Text> Investors held the token at
                  checkpoint time
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
