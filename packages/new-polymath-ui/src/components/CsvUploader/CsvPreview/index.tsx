import React, { FC, useContext } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { Table } from '~/components/Table';
import { ParseCsv, RenderProps as ParseCsvRenderProps } from '../ParseCsv';
import { Context } from '../Context';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;
type TableProps = typeHelpers.GetProps<typeof Table>;

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

export interface Props {
  tableConfig: typeHelpers.Omit<TableProps, 'data' | 'csvParserData'>;
}

const CsvPreviewComponent: FC<Props> = props => {
  const context = useContext(Context);

  if (!context) {
    return null;
  }

  const { isFullyInvalid, data, csvConfig } = context;
  const { tableConfig, ...otherProps } = props;

  if (isFullyInvalid) {
    return null;
  }

  return (
    <Table
      data={parsedCsvToTable(data.result)}
      columns={csvColumnsToTableColumns(csvConfig.columns)}
      csvParserData={data.result}
      {...tableConfig}
      {...otherProps}
    >
      <Table.Rows small />
      <Table.Pagination />
    </Table>
  );
};

export const CsvPreview = styled(CsvPreviewComponent)``;
