import React, { FC, useState } from 'react';
import { some } from 'lodash';
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
import {
  csvEthAddressKey,
  csvTaxWithholdingKey,
  TaxWithholdingsItem,
  TaxWithholdingStatuses,
} from './shared';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  existingTaxWithholdings: types.TaxWithholdingPojo[];
  onConfirm: (values: TaxWithholdingsItem[]) => void;
}

type CsvTaxWithholdingsData = any;

export const CsvModal: FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  existingTaxWithholdings,
}) => {
  const [taxWithholdings, setTaxWithholdings] = useState<
    CsvTaxWithholdingsData[]
  >([]);

  const onSubmit = () => {
    onConfirm(taxWithholdings);
  };

  const onChangeCsv = (result: TaxWithholdingsItem[] | null) => {
    if (result) {
      const formattedValues = result.map((value: TaxWithholdingsItem) => {
        let alreadyExists = false;
        const isUpdated = some(
          existingTaxWithholdings,
          existingTaxWithholding => {
            if (
              existingTaxWithholding.investorAddress === value[csvEthAddressKey]
            ) {
              alreadyExists = true;
            }

            return (
              alreadyExists &&
              value[csvTaxWithholdingKey] !== existingTaxWithholding.percentage
            );
          }
        );

        let status: TaxWithholdingStatuses | undefined;

        if (isUpdated) {
          status = TaxWithholdingStatuses.Updated;
        } else if (!alreadyExists) {
          status = TaxWithholdingStatuses.New;
        }

        return {
          ...value,
          [csvTaxWithholdingKey]: value[csvTaxWithholdingKey] / 100,
          status,
        };
      });
      setTaxWithholdings(formattedValues);
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
        Update tax withholdings by uploading a comma separated .CSV file. The format should be as follows:
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
        >
          <CsvUploader.CsvErrors />
          <CsvUploader.CsvPreview
            tableConfig={{
              columns: [
                {
                  accessor: csvEthAddressKey,
                  Header: csvEthAddressKey,
                  Cell: ({ value }) => {
                    return (
                      value && formatters.toShortAddress(value, { size: 26 })
                    );
                  },
                },
                {
                  accessor: csvTaxWithholdingKey,
                  Header: csvTaxWithholdingKey,
                },
              ],
            }}
          />
        </CsvUploaderPrimitive>
      </Grid>
    </ModalConfirm>
  );
};
