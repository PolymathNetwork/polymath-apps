import React, { FC, Fragment, useCallback } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import { Table } from '~/components/Table';
import { formikProxy } from '~/components/inputs/formikProxy';
import { ParseCsv } from './ParseCsv';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;

interface Props {
  name: string;
  config: ParseCsvProps['config'];
}

const CSVUploaderComponent: FC<Props> = ({ clearFile, setFile, data }) => {
  const handleFileUploaderChange = file => {
    // clearFile();
    setFile(file);
  };
  console.log(data);
  console.log(data.errors);
  return (
    <Fragment>
      <FileUploaderPrimitive onChange={handleFileUploaderChange} />
      {data ? (
        <Fragment>
          {data.errors}
          {/* <Table data={data.result} columns={[]}>
            <Table.Rows />
          </Table> */}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export const CSVUploaderPrimitive: FC<Props> = ({ config, ...formikProps }) => {
  return (
    <ParseCsv
      config={config}
      render={parseCsvProps => (
        <CSVUploaderComponent {...parseCsvProps} {...formikProps} />
      )}
    />
  );
};

export const CSVUploader = formikProxy(CSVUploaderPrimitive);
