import { Component, ReactNode } from 'react';
import { csvParser } from '@polymathnetwork/new-shared';

export interface RenderProps {
  data: csvParser.ResultProps;
  setFile(file: File): void;
  clearFile(): void;
}

export interface ParseResult {
  data: csvParser.ResultProps;
  config: Config;
  errors: string[];
  warnings: string[];
}

interface Config {
  columns: Array<csvParser.Column>;
  header?: boolean;
  maxRows?: number;
  strict?: boolean;
  parseErrorMessage: string;
  missingRequiredColumnsErrorMessage?: string;
  extraColumnsErrorMessage?: string;
  rowsExceedMaxLimitErrorMessage?: string;
}

interface Props {
  config: Config;
  render(output: RenderProps): ReactNode;
}

interface State {
  data: csvParser.ResultProps;
}

export class ParseCsv extends Component<Props, State> {
  public state = {
    data: {
      result: [],
      totalRows: 0,
      validRows: 0,
      errorRows: 0,
      ignoredRows: 0,
      isFileValid: false,
      errors: [],
    },
  };

  public setFile = async (file: string | File) => {
    const {
      missingRequiredColumnsErrorMessage,
      extraColumnsErrorMessage,
      rowsExceedMaxLimitErrorMessage,
      parseErrorMessage,
      ...csvConfig
    } = this.props.config;
    const fileProps: csvParser.Props = {
      data: file,
      ...csvConfig,
      errorMessages: {
        missingRequiredColumns: missingRequiredColumnsErrorMessage || '',
        extraColumns: extraColumnsErrorMessage || '',
        rowsExceedMaxLimit: rowsExceedMaxLimitErrorMessage || '',
      },
    };
    console.log(file);
    try {
      const parseResult = await csvParser.parseCsv(fileProps);
      this.setState({ data: parseResult });
    } catch {
      this.setState(prevState => ({
        data: {
          ...prevState.data,
          errors: [this.props.config.parseErrorMessage],
        },
      }));
    }
  };

  public clearFile = () => {
    // Logic here to reset the state
    this.setState({
      data: {
        result: [],
        totalRows: 0,
        validRows: 0,
        errorRows: 0,
        ignoredRows: 0,
        isFileValid: false,
        errors: [],
      },
    });
  };

  public render() {
    const { render } = this.props;
    return render({
      setFile: this.setFile,
      clearFile: this.clearFile,
      data: this.state.data,
    });
  }
}
