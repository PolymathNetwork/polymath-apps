import React, { FC, useCallback, useEffect } from 'react';
import { typeHelpers, csvParser } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import {
  FormikProxy,
  FormikExternalProps,
} from '~/components/inputs/FormikProxy';
import { ParseCsv, RenderProps as ParseCsvRenderProps } from './ParseCsv';
import * as sc from './styles';
import { Context } from './Context';
import { CsvErrors } from './CsvErrors';
import { CsvPreview } from './CsvPreview';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;
type Value = csvParser.ResultRow[] | csvParser.ResultProps[][] | null;

interface ComponentProps extends ParseCsvRenderProps {
  onChange: (value: Value) => void;
  csvConfig: ParseCsvProps['config'];
}

const CsvUploaderComponent: FC<ComponentProps> = ({
  clearFile,
  setFile,
  data,
  csvConfig,
  onChange,
  children,
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
    data.errorRows === data.totalRows || data.errorRows === csvConfig.maxRows;
  const errorCount = data.result.reduce((acc, cur) => {
    acc += Object.values(cur.data).filter((cell: any) => !cell.isColumnValid)
      .length;
    return acc;
  }, 0);

  return (
    <sc.Wrapper>
      <FileUploaderPrimitive onChange={handleFileUploaderChange} />
      {!!data.result.length ? (
        <Context.Provider
          value={{ isFullyInvalid, errorCount, data, csvConfig }}
        >
          {children}
        </Context.Provider>
      ) : null}
    </sc.Wrapper>
  );
};

interface PrimitiveProps {
  csvConfig: ParseCsvProps['config'];
  onChange: (value: Value) => void;
  name?: string;
  value?: Value;
  onBlur?: () => void;
}

const CsvUploaderPrimitiveComponent: FC<PrimitiveProps> = ({
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

export const CsvUploaderPrimitive = Object.assign(
  CsvUploaderPrimitiveComponent,
  {
    CsvErrors,
    CsvPreview,
  }
);

interface Props extends FormikExternalProps {
  csvConfig: ParseCsvProps['config'];
}

const CsvUploaderWithFormik: FC<Props> = ({ field, form, ...rest }) => (
  <FormikProxy<Value>
    field={field}
    form={form}
    render={formikProps => <CsvUploaderPrimitive {...rest} {...formikProps} />}
  />
);

export const CsvUploader = Object.assign(CsvUploaderWithFormik, {
  CsvErrors,
  CsvPreview,
});
