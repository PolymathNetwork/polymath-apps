import React, { FC, Fragment, useCallback, useEffect } from 'react';
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
import { csvParser } from '@polymathnetwork/new-shared';
import { ParseCsv, RenderProps as ParseCsvRenderProps } from './ParseCsv';
import * as sc from './styles';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;

type Value = csvParser.ResultRow[] | csvParser.ResultProps[][] | null;

const parsedCsvToTable = (parsedCsvRows: csvParser.ResultRow[]) => {
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
  config: ParseCsvProps['config'];
}

const CsvUploaderComponent: FC<ComponentProps> = ({
  clearFile,
  setFile,
  data,
  config,
  onChange,
}) => {
  const handleFileUploaderChange = useCallback(file => {
    clearFile();
    setFile(file);
  }, []);

  useEffect(
    () => {
      if (data.isFileValid) {
        onChange(data.result);
      } else {
        onChange(null);
      }
    },
    [data.isFileValid]
  );

  const isFullyInvalid =
    data.errorRows === data.totalRows || data.errorRows === config.maxRows;
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
            {config.maxRows && data.totalRows > config.maxRows && (
              <Notification
                status="warning"
                title={`More Than ${config.maxRows} Records Found`}
                description={`Only ${
                  config.maxRows
                } records can be uploaded at a time. Any records above ${
                  config.maxRows
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
            {!!errorCount && (
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
                columns={csvColumnsToTableColumns(config.columns)}
                csvParserData={data.result}
              >
                <Table.Rows small />
              </Table>
            </Box>
          )}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

interface PrimitiveProps extends FormikProxyRenderProps<Value> {
  config: ParseCsvProps['config'];
}

export const CsvUploaderPrimitive: FC<PrimitiveProps> = ({
  config,
  ...formikProps
}) => {
  return (
    <ParseCsv
      config={config}
      render={parseCsvProps => (
        <CsvUploaderComponent
          config={config}
          {...parseCsvProps}
          {...formikProps}
        />
      )}
    />
  );
};

interface Props extends FormikExternalProps {
  config: ParseCsvProps['config'];
}

export const CsvUploader: FC<Props> = ({ field, form, ...rest }) => (
  <FormikProxy<Value>
    field={field}
    form={form}
    render={formikProps => <CsvUploaderPrimitive {...rest} {...formikProps} />}
  />
);
