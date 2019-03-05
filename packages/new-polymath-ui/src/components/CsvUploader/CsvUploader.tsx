import React, { FC, Fragment, useCallback } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import { Notification } from '~/components/Notification';
import { Box } from '~/components/Box';
import { Table } from '~/components/Table';
import {
  FormikProxy,
  FormikExternalProps,
  RenderProps as FormikProxyRenderProps,
} from '~/components/inputs/FormikProxy';
import { ParseCsv, RenderProps as ParseCsvRenderProps } from './ParseCsv';
import * as sc from './styles';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;
type TableProps = typeHelpers.GetProps<typeof Table>;

type Value = File | File[] | null;

const parsedCsvToTable = (
  parsedCsvRows: ParseCsvRenderProps['data']['result']
) => {
  return parsedCsvRows.map(parsedCsvRow =>
    Object.keys(parsedCsvRow.data).reduce((acc, curr) => {
      return { ...acc, [curr]: parsedCsvRow.data[curr].value };
    }, {})
  );
};

const csvColumnsToTableColumns = (
  csvColumns: ParseCsvProps['config']['columns']
) => {
  return csvColumns.map(csvColumn => ({
    ...csvColumn,
    accessor: csvColumn.name,
    Header: csvColumn.name,
  }));
};

interface ComponentProps extends ParseCsvRenderProps {
  onChange: (value: Value) => void;
  csvConfig: ParseCsvProps['config'];
  tableConfig: typeHelpers.Omit<TableProps, 'data' | 'csvParserData'>;
}

const CsvUploaderComponent: FC<ComponentProps> = ({
  clearFile,
  setFile,
  data,
  csvConfig,
  tableConfig,
  onChange,
}) => {
  const handleFileUploaderChange = useCallback(file => {
    clearFile();
    setFile(file);
    onChange(file);
  }, []);

  const isFullyInvalid =
    data.errorRows === data.totalRows || data.errorRows === csvConfig.maxRows;
  const errorCount = data.result.reduce((acc, cur) => {
    acc += Object.values(cur.data).filter((cell: any) => !cell.isColumnValid)
      .length;
    return acc;
  }, 0);

  return (
    <Fragment>
      <FileUploaderPrimitive onChange={handleFileUploaderChange} />
      {!!data.result.length ? (
        <Fragment>
          <sc.ErrorsWrapper>
            {csvConfig.maxRows && data.totalRows > csvConfig.maxRows && (
              <Notification
                status="warning"
                title={`More Than ${csvConfig.maxRows} Records Found`}
                description={`Only ${
                  csvConfig.maxRows
                } records can be uploaded at a time. Any records above ${
                  csvConfig.maxRows
                } limit will not be added.`}
              />
            )}
            {isFullyInvalid && (
              <Notification
                status="alert"
                title="Your .csv is Invalid"
                description="Please make sure your .csv file follows the format of format our sample file."
              />
            )}
            {errorCount && (
              <Notification
                status="alert"
                title={`${errorCount} Errors in Your .csv File`}
                description="Please note that the entries below contains error that prevent their content to be committed to the blockchain. Entries were automatically deselected so they are not submitted to the blockchain and may be edited separately. You can also elect to cancel the minting operation to review the csv file offline."
              />
            )}
          </sc.ErrorsWrapper>
          {!isFullyInvalid && (
            <Box mt="m">
              <Table
                data={parsedCsvToTable(data.result)}
                columns={csvColumnsToTableColumns(csvConfig.columns)}
                csvParserData={data.result}
                {...tableConfig}
              >
                <Table.Rows small />
                <Table.Pagination />
              </Table>
            </Box>
          )}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

interface PrimitiveProps {
  csvConfig: ParseCsvProps['config'];
  tableConfig: typeHelpers.Omit<TableProps, 'data' | 'csvParserData'>;
  onChange: (value: Value) => void;
  name?: string;
  value?: Value;
  onBlur?: () => void;
}

export const CsvUploaderPrimitive: FC<PrimitiveProps> = ({
  csvConfig,
  ...formikProps
}) => {
  return (
    <ParseCsv
      config={csvConfig}
      render={parseCsvProps => (
        <CsvUploaderComponent
          csvConfig={csvConfig}
          {...parseCsvProps}
          {...formikProps}
        />
      )}
    />
  );
};

interface Props extends FormikExternalProps {
  csvConfig: ParseCsvProps['config'];
  tableConfig: typeHelpers.Omit<TableProps, 'data' | 'csvParserData'>;
}

export const CsvUploader: FC<Props> = ({ field, form, ...rest }) => (
  <FormikProxy<Value>
    field={field}
    form={form}
    render={formikProps => <CsvUploaderPrimitive {...rest} {...formikProps} />}
  />
);
