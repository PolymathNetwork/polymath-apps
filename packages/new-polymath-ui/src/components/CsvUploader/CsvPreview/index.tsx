import React, { Component } from 'react';
import { typeHelpers, csvParser } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { Table } from '~/components/Table';
import {
  RenderProps as ParseCsvRenderProps,
  Props as ParseCsvProps,
} from '../ParseCsv';
import { getContext, CsvContext } from '../Context';

type TableProps = typeHelpers.GetProps<typeof Table>;

const parsedCsvToTable = <Output extends csvParser.Output>(
  parsedCsvRows: ParseCsvRenderProps<Output>['data']['result']
) => {
  return parsedCsvRows.map(parsedCsvRow =>
    Object.keys(parsedCsvRow.data).reduce<Output>(
      (acc, curr) => {
        return { ...acc, [curr]: parsedCsvRow.data[curr].value };
      },
      {} as Output
    )
  );
};

const csvColumnsToTableColumns = <Output extends csvParser.Output>(
  csvColumns: ParseCsvProps<Output>['config']['columns']
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

export class CsvPreviewComponent<
  Output extends csvParser.Output
> extends Component<Props> {
  static contextType = getContext();

  public render() {
    const context: CsvContext<Output> = this.context;

    if (!context) {
      return null;
    }

    const { isFullyInvalid, data, csvConfig } = context;
    const { tableConfig, ...otherProps } = this.props;

    if (isFullyInvalid) {
      return null;
    }

    return (
      <Table
        data={parsedCsvToTable<Output>(data.result)}
        columns={csvColumnsToTableColumns<Output>(csvConfig.columns)}
        csvParserData={data.result}
        {...tableConfig}
        {...otherProps}
      >
        <Table.Rows small />
        <Table.Pagination />
      </Table>
    );
  }
}

export const CsvPreview = styled(CsvPreviewComponent)``;
