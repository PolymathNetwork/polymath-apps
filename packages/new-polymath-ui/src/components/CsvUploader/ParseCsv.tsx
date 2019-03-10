import { Component, ReactNode } from 'react';
import { csvParser } from '@polymathnetwork/new-shared';

export interface RenderProps<Output extends csvParser.Output> {
  data: csvParser.ResultProps<Output>;
  setFile(file: File): void;
  clearFile(): void;
}

export interface ParseResult<Output extends csvParser.Output> {
  data: csvParser.ResultProps<Output>;
  config: Config;
  errors: string[];
  warnings: string[];
}

export interface Config {
  columns: Array<csvParser.Column>;
  header?: boolean;
  maxRows?: number;
  strict?: boolean;
}

export interface Props<Output extends csvParser.Output> {
  config: Config;
  render(output: RenderProps<Output>): ReactNode;
}

interface State<Output extends csvParser.Output> {
  data: csvParser.ResultProps<Output>;
}

export class ParseCsv<Output extends csvParser.Output> extends Component<
  Props<Output>,
  State<Output>
> {
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
    const fileProps: csvParser.Props = {
      data: file,
      ...this.props.config,
    };

    try {
      const parseResult = await csvParser.parseCsv<Output>(fileProps);
      this.setState({ data: parseResult });
    } catch {
      // We swallow the error has they are already appended to the result.
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
