import React, { useCallback, useEffect, Component } from 'react';
import { typeHelpers, csvParser } from '@polymathnetwork/new-shared';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import {
  FormikProxy,
  FormikExternalProps,
} from '~/components/inputs/FormikProxy';
import { ParseCsv, RenderProps as ParseCsvRenderProps } from './ParseCsv';
import * as sc from './styles';
import { CsvErrors } from './CsvErrors';
import { CsvPreview } from './CsvPreview';
import { getContext } from '~/components/CsvUploader/Context';

type ParseCsvProps = typeHelpers.GetProps<typeof ParseCsv>;
type Value<Output extends csvParser.Output> =
  | csvParser.ResultRow<Output>[]
  | csvParser.ResultProps<Output>[][]
  | null;

interface ComponentProps<Output extends csvParser.Output>
  extends ParseCsvRenderProps<Output> {
  onChange: (value: Value<Output>) => void;
  csvConfig: ParseCsvProps['config'];
}

class CsvUploaderComponent<Output extends csvParser.Output> extends Component<
  ComponentProps<Output>
> {
  public render() {
    const {
      clearFile,
      setFile,
      data,
      csvConfig,
      onChange,
      children,
    } = this.props;

    const handleFileUploaderChange = useCallback(
      (file: File | File[] | null) => {
        clearFile();
        if (file instanceof File) {
          setFile(file);
        } else {
          throw new Error('Must supply a single file to the CSV uploader.');
        }
      },
      []
    );

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

    const Context = getContext();

    const isFullyInvalid =
      !data.isFileValid &&
      (data.errorRows === data.totalRows ||
        data.errorRows === csvConfig.maxRows);
    const errorCount = data.result.reduce((acc, cur) => {
      acc += Object.values(cur.data).filter((cell: any) => !cell.isColumnValid)
        .length;
      return acc;
    }, 0);

    return (
      <sc.Wrapper>
        <FileUploaderPrimitive
          accept=".csv"
          onChange={handleFileUploaderChange}
        />
        {!!data.result.length ? (
          <Context.Provider
            value={{ isFullyInvalid, errorCount, data, csvConfig }}
          >
            {children}
          </Context.Provider>
        ) : null}
      </sc.Wrapper>
    );
  }
}

interface PrimitiveProps<Output extends csvParser.Output> {
  csvConfig: ParseCsvProps['config'];
  onChange: (value: Value<Output>) => void;
  name?: string;
  value?: Value<Output>;
  onBlur?: () => void;
}

class CsvUploaderPrimitiveComponent<
  Output extends csvParser.Output
> extends Component<PrimitiveProps<Output>> {
  public render() {
    const { csvConfig, ...formikProps } = this.props;

    return (
      <ParseCsv<Output>
        config={csvConfig}
        render={parseCsvProps => (
          <CsvUploaderComponent<Output>
            csvConfig={csvConfig}
            {...parseCsvProps}
            {...formikProps}
          />
        )}
      />
    );
  }
}

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

class CsvUploaderWithFormik<Output extends csvParser.Output> extends Component<
  Props
> {
  public render() {
    const { field, form, ...rest } = this.props;

    return (
      <FormikProxy<Value<Output>>
        field={field}
        form={form}
        render={formikProps => (
          <CsvUploaderPrimitive<Output> {...rest} {...formikProps} />
        )}
      />
    );
  }
}

export const CsvUploader = Object.assign(CsvUploaderWithFormik, {
  CsvErrors,
  CsvPreview,
});
