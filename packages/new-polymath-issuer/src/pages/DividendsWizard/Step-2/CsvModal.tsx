import React, { FC, useState } from 'react';
import {
  ModalConfirm,
  CsvUploader,
  Paragraph,
  List,
  CsvUploaderPrimitive,
  Text,
  Grid,
} from '@polymathnetwork/new-ui';
import { validators, formatters, types } from '@polymathnetwork/new-shared';
import { csvEthAddressKey, csvTaxWithholdingKey } from './shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formTaxWithholdings: types.TaxWithholdingPojo[];
  onConfirm: (values: types.TaxWithholdingPojo[]) => void;
}

type CsvTaxWithholdingsData = any;

export const CsvModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  formTaxWithholdings,
}) => {
  const [taxWithholdings, setTaxWithholdings] = useState<
    CsvTaxWithholdingsData[]
  >([]);

  const onSubmit = () => {
    onConfirm(taxWithholdings);
  };

  const onChangeCsv = (result: any[] | null) => {
    if (result) {
      setTaxWithholdings(result);
    }
  };

  return (
    <ModalConfirm
      isOpen={isOpen}
      onSubmit={onSubmit}
      onClose={onClose}
      actionButtonText="Confirm"
      isActionDisabled={!taxWithholdings}
      maxWidth={500}
    >
      <ModalConfirm.Header>Upload Tax Withholding List</ModalConfirm.Header>
      <Paragraph mb={0}>
        For tax withholdings, the format should be as follows:
      </Paragraph>
      <List vertical gridGap={0}>
        <li>
          <Text>— Investor wallet's ETH Address;</Text>
        </li>
        <li>
          <Text>
            — % tax witholding for associated ETH address. The exact amount of
            funds to be withheld will be automatically calculated prior to
            distribution.
          </Text>
        </li>
      </List>
      <Grid mt="gridGap">
        <CsvUploaderPrimitive
          onChange={onChangeCsv}
          csvConfig={{
            columns: [
              {
                name: csvEthAddressKey,
                validators: [
                  validators.isEthereumAddress,
                  validators.isNotEmpty,
                ],
                required: true,
              },
              {
                name: csvTaxWithholdingKey,
                validators: [validators.isNotEmpty],
                required: true,
              },
            ],
            header: true,
            maxRows: 200,
          }}
        />
        <CsvUploader.CsvErrors />
        <CsvUploader.CsvPreview
          tableConfig={{
            columns: [
              {
                accessor: csvEthAddressKey,
                Header: csvEthAddressKey,
                Cell: ({ value }) =>
                  value && formatters.toShortAddress(value, { size: 26 }),
              },
              {
                accessor: csvTaxWithholdingKey,
                Header: csvTaxWithholdingKey,
              },
            ],
          }}
        />
      </Grid>
    </ModalConfirm>
  );
};
