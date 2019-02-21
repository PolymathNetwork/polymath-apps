import React, { Component, ReactNode } from 'react';
import { csvParser } from '@polymathnetwork/new-shared';

export interface RenderProps {
  data: csvParser.ResultProps;
  setFile(fileProps: csvParser.Props): void;
  clearFile(): void;
}

interface Props {
  render(input: RenderProps): ReactNode;
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

  public setFile = (fileProps: csvParser.Props) => {
    csvParser.parseCsv(fileProps).then((parseResult: csvParser.ResultProps) => {
      this.setState({ data: parseResult });
    });
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
