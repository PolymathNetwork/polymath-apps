import React, { FC, Fragment, useCallback } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import { Notification } from '~/components/Notification';
import { Box } from '~/components/Box';
import { Table } from '~/components/Table';
import { formikProxy } from '~/components/inputs/formikProxy';
import { ParseCsv } from './ParseCsv';
import * as sc from './styles';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;

const parsedCsvToTable = parsedCsvRows => {
  return parsedCsvRows.map(parsedCsvRow =>
    Object.keys(parsedCsvRow.data).reduce((acc, curr) => {
      return { ...acc, [curr]: parsedCsvRow.data[curr].value };
    }, {})
  );
};

const csvColumnsToTableColumns = csvColumns => {
  return csvColumns.map(csvColumn => ({
    ...csvColumn,
    accessor: csvColumn.name,
    Header: csvColumn.name,
  }));
};

interface Props {
  name: string;
  config: ParseCsvProps['config'];
}

const CsvUploaderComponent: FC<Props> = ({
  clearFile,
  setFile,
  data,
  config,
}) => {
  const handleFileUploaderChange = useCallback(file => {
    clearFile();
    setFile(file);
  }, []);
  console.log(data);
  console.log(data.result);
  console.log(parsedCsvToTable(data.result));
  const isFullyInvalid =
    data.errorRows === data.totalRows || data.errorRows === config.maxRows;

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
          </sc.ErrorsWrapper>
          {!isFullyInvalid && (
            <Box mt="m">
              <Table
                data={parsedCsvToTable(data.result)}
                columns={csvColumnsToTableColumns(config.columns)}
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

export const CsvUploaderPrimitive: FC<Props> = ({ config, ...formikProps }) => {
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

export const CsvUploader = formikProxy(CsvUploaderPrimitive);
