import React, { Fragment, useState, useCallback, FC } from 'react';
import {
  validators,
  formatters,
  csvParser,
  utils,
  types,
} from '@polymathnetwork/new-shared';
import {
  Box,
  Button,
  ButtonSmall,
  Icon,
  icons,
  Heading,
  Card,
  Paragraph,
  Remark,
  Flex,
  InlineFlex,
  Form,
  FormItem,
  Checkbox,
  List,
  Grid,
  CsvUploader,
  ModalConfirm,
  Table,
  Text,
  Link,
  LinkButton,
  IconButton,
  TextInput,
  PercentageInput,
  validator,
} from '@polymathnetwork/new-ui';

interface Props {
  onNextStep: () => void;
  existingTaxWithholdings: types.TaxWithholdingPojo[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => void;
}

interface Values {
  taxWithholdings: types.TaxWithholdingPojo[];
}

/**
 * 1. There is ONE taxWithholdings list that we manage
 * 2. This list is values.taxWithholdings list
 */

export const Step2: FC<Props> = ({
  onNextStep,
  existingTaxWithholdings,
  downloadTaxWithholdingList,
}) => {
  const onSubmit = (values: Values) => {
    console.log('values', values);
  };

  const downloadExistingTaxWithholdings = () => {
    downloadTaxWithholdingList(existingTaxWithholdings);
  };

  return (
    <Form<Values>
      onSubmit={onSubmit}
      initialValues={{
        taxWithholdings: existingTaxWithholdings,
      }}
      render={({ values }) => {
        return (
          <Card p="gridGap" boxShadow={1}>
            <Heading variant="h2" mb="l">
              2. Add/Update Tax Withholdings List
            </Heading>
            <Paragraph>
              Optionally withhold taxes for applicable investor wallet addresses
              by uploading a CSV which includes, for investors subject to tax
              withholdings:{' '}
            </Paragraph>
            <List vertical gridGap={0}>
              <li>
                <Text>— Investor wallet's ETH Address;</Text>
              </li>
              <li>
                <Text>
                  — % tax witholding for associated ETH address. The exact
                  amount of funds to be withheld will be automatically
                  calculated prior to distribution.
                </Text>
              </li>
            </List>
            {existingTaxWithholdings.length ? (
              <Paragraph>
                You can download{' '}
                <LinkButton onClick={downloadExistingTaxWithholdings}>
                  <Icon Asset={icons.SvgDownload} />{' '}
                  Existing-Withholdings-Tax-List.csv
                </LinkButton>{' '}
                file and edit it.
              </Paragraph>
            ) : (
              <Paragraph>
                You can download{' '}
                <button
                  onClick={() => {
                    // TODO: Add sample file download
                  }}
                >
                  <Icon Asset={icons.SvgDownload} />{' '}
                  Sample-Withholdings-Tax-List.csv
                </button>{' '}
                example file and edit it.
              </Paragraph>
            )}
          </Card>
        );
      }}
    />
  );
};
