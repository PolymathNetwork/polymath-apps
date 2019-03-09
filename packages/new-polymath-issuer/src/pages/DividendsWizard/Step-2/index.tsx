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
import _ from 'lodash';
import { HeaderColumn } from 'react-table';
import { validateYupSchema, yupToFormErrors } from 'formik';

export interface Props {
  onNextStep: () => void;
  values: any;
  taxWithholdings: types.TaxWithholdingEntity[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => void;
}

const csvEthAddressKey = 'Investor ETH Address';
const csvTaxWithholdingKey = '% Tax Withholding';

const Step2Presenter = ({
  onNextStep,
  values,
  taxWithholdings,
  downloadTaxWithholdingList,
}: Props) => {
  const [isCsvModalOpen, setCsvModalState] = useState(false);
  const [isEditModalOpen, setEditModalState] = useState(false);
  const [isAddModalOpen, setAddModalState] = useState(false);
  const [withholdingList, setWithholdingList] = useState(
    taxWithholdings.reduce((result: any[], element) => {
      if (element.percentage > 0) {
        result.push(element);
      }
      return result;
    }, [])
  );

  const [investorTaxWithholding, setInvestorTaxWithholding] = useState({
    withholdingPercent: '',
    investorETHAddress: 0,
  });

  const deleteRow = (investorAddress: string) => {
    setWithholdingList(
      _.remove(withholdingList, item => {
        return item.investorWalletAddress !== investorAddress;
      })
    );
  };

  const editRow = (rowValues: any) => {
    setInvestorTaxWithholding({
      investorETHAddress: rowValues.investorWalletAddress,
      withholdingPercent: rowValues.withholdingPercent,
    });
    setEditModalState(true);
  };

  const columns: HeaderColumn[] = [
    {
      Header: csvEthAddressKey,
      accessor: csvEthAddressKey,
      Cell: ({ value }) =>
        value && formatters.toShortAddress(value, { size: 26 }),
    },
    {
      Header: '% Tax Witholding for Associated ETH Address',
      accessor: csvTaxWithholdingKey,
      width: 250,
      Cell: ({ value }) => `${value}%`,
    },
    {
      accessor: 'actions',
      width: 80,
      Cell: cell => (
        <Table.RowActions>
          <IconButton
            Asset={icons.SvgPen}
            width="1.4rem"
            height="1.4rem"
            color="gray.2"
            onClick={() => {
              editRow(cell.row.values);
            }}
          />
          <IconButton
            Asset={icons.SvgDelete}
            width="1.4rem"
            height="1.4rem"
            color="gray.2"
            onClick={() => deleteRow(cell.row.values.investorWalletAddress)}
          />
        </Table.RowActions>
      ),
    },
  ];

  const handleCsvModalOpen = useCallback(() => {
    setCsvModalState(true);
  }, []);

  const handleEditModalConfirm = (formProps: any) => {
    const modifiedWithholdings = [...withholdingList];
    const index: number = _.findIndex(modifiedWithholdings, (item: any) => {
      return (
        item.investorWalletAddress === investorTaxWithholding.investorETHAddress
      );
    });
    modifiedWithholdings.splice(index, 1, {
      investorWalletAddress: formProps.investorETHAddress,
      withholdingPercent: formProps.withholdingPercent,
    });
    setWithholdingList(modifiedWithholdings);
    setEditModalState(false);
  };

  const handleAddNewOpen = () => {
    setAddModalState(true);
  };

  const handleEditModalClose = useCallback(() => {
    setEditModalState(false);
  }, []);

  const handleCsvModalClose = useCallback(() => {
    setCsvModalState(false);
  }, []);

  const handleAddModalClose = useCallback(() => {
    setAddModalState(false);
  }, []);

  const handleCsvModalConfirm = useCallback(
    () => {
      console.log('values.taxWithholdingsCsv', values.taxWithholdingsCsv);
      const addedEntries = values.taxWithholdingsCsv.map(
        (csvRow: csvParser.ResultRow) => ({
          investorWalletAddress: csvRow.data[csvEthAddressKey].value,
          withholdingPercent: csvRow.data[csvTaxWithholdingKey].value,
        })
      );
      // Existing tax withholding should be only added if they are not overwritten
      withholdingList.map(item => {
        if (
          !_.find(
            addedEntries,
            o => o.investorWalletAddress === item.investorWalletAddress
          )
        ) {
          addedEntries.push(item);
        }
      });
      setWithholdingList(addedEntries);
      setCsvModalState(false);
    },
    [values]
  );

  const handleAddSubmit = useCallback(formData => {
    setWithholdingList([...withholdingList, formData]);
    setAddModalState(false);
  }, []);

  const downloadExistingWithholdings = () => {
    utils.downloadCsvFile(
      withholdingList,
      'Existing-Withholdings-Tax-List.csv',
      { fields: [csvEthAddressKey, csvTaxWithholdingKey] }
    );
  };

  const validateFormWithSchema = (
    validationSchema: any,
    validationValues: any
  ) => {
    try {
      validateYupSchema(validationValues, validationSchema, true);
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  const handleWithholdingValidation = useCallback((validationValues: any) => {
    const schema = validator.object().shape({
      investorETHAddress: validator
        .string()
        .required('Investor ETH address is required')
        .isEthereumAddress('Invalid Ethereum Address'),
      withholdingPercent: validator
        .number()
        .typeError('Invalid value')
        .min(0, 'Invalid value')
        .max(100, 'Invalid value')
        .required('Tax withholsing percent is required'),
    });
    return validateFormWithSchema(schema, validationValues);
  }, []);

  const handleSampleCsvDownload = useCallback(
    () => {
      downloadTaxWithholdingList(taxWithholdings);
    },
    [taxWithholdings]
  );

  return (
    <Card p="gridGap" boxShadow={1}>
      <Heading variant="h2" mb="l">
        2. Add/Update Tax Withholdings List
      </Heading>
      <Paragraph>
        Optionally withhold taxes for applicable investor wallet addresses by
        uploading a CSV which includes, for investors subject to tax
        withholdings:{' '}
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
      {withholdingList.length ? (
        <Paragraph>
          You can download{' '}
          <LinkButton onClick={downloadExistingWithholdings}>
            <Icon Asset={icons.SvgDownload} />{' '}
            Existing-Withholdings-Tax-List.csv
          </LinkButton>{' '}
          file and edit it.
        </Paragraph>
      ) : (
        <Paragraph>
          You can download{' '}
          <button onClick={handleSampleCsvDownload}>
            <Icon Asset={icons.SvgDownload} /> Sample-Withholdings-Tax-List.csv
          </button>{' '}
          example file and edit it.
        </Paragraph>
      )}
      <Button
        variant="ghostSecondary"
        iconPosition="right"
        onClick={handleCsvModalOpen}
      >
        Upload Tax Withholdings List
        <Icon Asset={icons.SvgDownload} width={18} height={18} />
      </Button>
      <ModalConfirm
        isOpen={isCsvModalOpen}
        onSubmit={handleCsvModalConfirm}
        onClose={handleCsvModalClose}
        actionButtonText="Confirm"
        isActionDisabled={!values.taxWithholdingsCsv}
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
          <FormItem name="taxWithholdingsCsv">
            <FormItem.Input
              component={CsvUploader}
              inputProps={{
                csvConfig: {
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
                },
              }}
            >
              <CsvUploader.CsvErrors />
              <CsvUploader.CsvPreview
                tableConfig={{
                  columns: [
                    {
                      accessor: columns[0].accessor,
                      Header: columns[0].Header,
                      Cell: ({ value }) =>
                        value && formatters.toShortAddress(value, { size: 26 }),
                    },
                    {
                      accessor: columns[1].accessor,
                      Header: columns[1].Header,
                    },
                  ],
                }}
              />
            </FormItem.Input>
            <FormItem.Error />
          </FormItem>
        </Grid>
      </ModalConfirm>
      <Remark>
        Taxes will be withheld by the dividends smart contract at the time
        dividends are distributed. Withholdings can subsequently be withdrawn
        into a designated wallet for tax payments.
        <br />
        <strong>Maximum number of entries per transaction is 200.</strong>
        <br />
        If you want to withhold taxes for more than 200 wallets, please
        breakdown the list in 200 wallets increments and upload them one at a
        time.
      </Remark>

      <Form
        validate={handleWithholdingValidation}
        enableReinitialize
        initialValues={{
          investorETHAddress: investorTaxWithholding.investorETHAddress,
          withholdingPercent: investorTaxWithholding.withholdingPercent,
        }}
        onSubmit={() => {}}
        render={subProps => {
          return (
            <ModalConfirm
              isOpen={isEditModalOpen}
              onSubmit={() => {
                subProps.submitForm();
                if (subProps.isValid) {
                  handleEditModalConfirm(subProps.values);
                }
              }}
              onClose={handleEditModalClose}
              actionButtonText="Confirm"
            >
              <ModalConfirm.Header>
                Add Tax Withholding for Specific Investor
              </ModalConfirm.Header>
              <Paragraph mb={0}>
                Specify the Investor's wallet address and its associated tax
                withholdings. The specified percentage will be withheld at the
                time dividends are paid.
              </Paragraph>
              <Grid mt="gridGap">
                <Fragment>
                  <FormItem name="investorETHAddress">
                    <FormItem.Label>Investor ETH Address</FormItem.Label>
                    <FormItem.Input component={TextInput} />
                    <FormItem.Error />
                  </FormItem>
                  <FormItem name="withholdingPercent">
                    <FormItem.Label>
                      % Tax Witholding for Associated ETH Address
                    </FormItem.Label>
                    <FormItem.Input component={PercentageInput} />
                    <FormItem.Error />
                  </FormItem>
                </Fragment>
              </Grid>
            </ModalConfirm>
          );
        }}
      />

      {!!withholdingList.length && (
        <Box mt="m" mb="m">
          <Table columns={columns} data={withholdingList} selectable>
            <Table.Toolbar>
              {() => {
                return (
                  <Flex>
                    <Box ml="auto">
                      <ButtonSmall
                        variant="secondary"
                        iconPosition="right"
                        onClick={handleAddNewOpen}
                      >
                        Update <Icon Asset={icons.SvgCycle} />
                      </ButtonSmall>
                      <InlineFlex ml="m">
                        <ButtonSmall
                          iconPosition="right"
                          onClick={handleAddNewOpen}
                        >
                          Add new <Icon Asset={icons.SvgPlusPlain} />
                        </ButtonSmall>
                      </InlineFlex>
                    </Box>
                  </Flex>
                );
              }}
            </Table.Toolbar>
            <Table.BatchActionsToolbar>
              {(batchActionProps: any) => {
                const handleDeleteRows = () => {
                  setWithholdingList(
                    _.remove(withholdingList, item => {
                      return _.find(batchActionProps.selectedRows, o => {
                        return (
                          o.values.investorWalletAddress !==
                          item.investorWalletAddress
                        );
                      });
                    })
                  );
                };

                return (
                  <Fragment>
                    <Button
                      variant="ghost"
                      iconPosition="right"
                      onClick={handleDeleteRows}
                    >
                      Delete <Icon Asset={icons.SvgDelete} />
                    </Button>
                  </Fragment>
                );
              }}
            </Table.BatchActionsToolbar>
            <Table.Rows />
            <Table.Pagination />
          </Table>
        </Box>
      )}
      <Heading variant="h3" mt="m">
        Confirm Tax Withholdings
      </Heading>
      <Paragraph>
        Please make sure to confirm no changes are required by downloading and
        reviewing the current configuration.
      </Paragraph>
      <FormItem name="isTaxWithholdingConfirmed">
        <FormItem.Input
          component={Checkbox}
          inputProps={{
            label:
              'I’m sure I don’t need any adds/updates to the Tax Withholdings List.',
          }}
        />
        <FormItem.Error />
      </FormItem>
      <Box mt="xl">
        <Button
          onClick={onNextStep}
          disabled={!values.isTaxWithholdingConfirmed}
        >
          Update list and proceed to the next step
        </Button>
      </Box>
      <Form
        initialValues={{
          investorWalletAddress: '',
          withholdingPercent: 0,
        }}
        onSubmit={handleAddSubmit}
        render={({ handleSubmit, isValid }) => (
          <ModalConfirm
            isOpen={isAddModalOpen}
            onSubmit={handleSubmit}
            onClose={handleAddModalClose}
            actionButtonText="Confirm"
            isActionDisabled={!isValid}
            maxWidth={500}
          >
            <ModalConfirm.Header>
              Add Taxwithholding for Specific investor
            </ModalConfirm.Header>
            <Paragraph mb={0}>
              Specify the Investor's wallet address and its associated tax
              withholdings. The specified percentage will be withheld at the
              time dividends are paid.
            </Paragraph>
            <form onSubmit={handleSubmit}>
              <Grid mt="gridGap">
                <FormItem name="investorWalletAddress">
                  <FormItem.Label>Investor ETH Address</FormItem.Label>
                  <FormItem.Input component={TextInput} />
                  <FormItem.Error />
                </FormItem>
                <FormItem name="withholdingPercent">
                  <FormItem.Label>
                    % Tax Withholding for Associated ETH Address
                  </FormItem.Label>
                  <Box maxWidth={100}>
                    <FormItem.Input component={PercentageInput} />
                  </Box>
                  <FormItem.Error />
                </FormItem>
              </Grid>
            </form>
          </ModalConfirm>
        )}
      />
    </Card>
  );
};

export const Step2: FC<{
  onNextStep: () => void;
  taxWithholdings: types.TaxWithholdingPojo[];
  downloadTaxWithholdingList: (
    taxWithholdings: types.TaxWithholdingPojo[]
  ) => void;
}> = ({ onNextStep, taxWithholdings, downloadTaxWithholdingList }) => {
  return (
    <Form
      onSubmit={(values: any) => {
        console.log('Submitting step 2', values);
      }}
      initialValues={{
        taxWithholdingsCsv: null,
        isTaxWithholdingConfirmed: false,
      }}
      render={({ values }) => (
        <Step2Presenter
          taxWithholdings={taxWithholdings}
          onNextStep={onNextStep}
          downloadTaxWithholdingList={downloadTaxWithholdingList}
          values={values}
        />
      )}
    />
  );
};
