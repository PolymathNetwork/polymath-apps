import React, { FC, Fragment, useCallback } from 'react';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import { Notification } from '~/components/Notification';
import { Table } from '~/components/Table';
import { formikProxy } from '~/components/inputs/formikProxy';
import { ParseCsv } from './ParseCsv';
import * as sc from './styles';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;

interface Props {
  name: string;
  config: ParseCsvProps['config'];
}

const CSVUploaderComponent: FC<Props> = ({
  clearFile,
  setFile,
  data,
  config,
}) => {
  const handleFileUploaderChange = file => {
    clearFile();
    setFile(file);
  };
  console.log(config.maxRows);

  return (
    <Fragment>
      <FileUploaderPrimitive onChange={handleFileUploaderChange} />
      {!!data.result.length ? (
        <Fragment>
          <sc.ErrorsWrapper>
            {config.maxRows && data.totalRows > config.maxRows && (
              <Notification
                status="warning"
                title="the title"
                description="the description"
              />
            )}
          </sc.ErrorsWrapper>
          <Table data={data.result} columns={config.columns}>
            <Table.Rows />
          </Table>
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
        <CSVUploaderComponent
          config={config}
          {...parseCsvProps}
          {...formikProps}
        />
      )}
    />
  );
};

export const CSVUploader = formikProxy(CSVUploaderPrimitive);
