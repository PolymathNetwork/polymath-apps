import React from 'react';
import { render, cleanup, wait } from 'react-testing-library';
import { ParseCsv, RenderProps } from '../ParseCsv';
import { validators } from '@polymathnetwork/new-shared';

afterEach(cleanup);

describe('ParseCsv component', () => {
  it('calls the render function', () => {
    const renderMock = jest.fn(() => {
      return <div>Hello</div>;
    });
    render(<ParseCsv parseErrorMessage="Parsing Error" render={renderMock} />);
    expect(renderMock).toHaveBeenCalled();
  });

  it('sets the result when setFile is called', async () => {
    let setFile: Function = () => null;
    let clearFile: Function = () => null;
    let result: Array<any> = [];
    const renderFunction = (inputParams: RenderProps) => {
      setFile = inputParams.setFile;
      clearFile = inputParams.clearFile;
      result = inputParams.data.result;
      return <div>Hello</div>;
    };
    render(
      <ParseCsv parseErrorMessage="Parsing Error" render={renderFunction} />
    );

    setFile({
      data: `column 1, column 2
      value 1, value 2`,
      columns: [
        {
          name: 'column 1',
          validators: [validators.isString, validators.isNotEmpty],
        },
        {
          name: 'column 2',
          validators: [validators.isString, validators.isNotEmpty],
        },
      ],
      header: true,
      maxRows: 2,
    });

    await wait(() => expect(result.length).toBe(1));
    clearFile();
    expect(result.length).toBe(0);
  });

  it('clears the result when clearFile is called', async () => {
    let setFile: Function = () => null;
    let clearFile: Function = () => null;
    let result: Array<any> = [];
    const renderFunction = (inputParams: RenderProps) => {
      setFile = inputParams.setFile;
      clearFile = inputParams.clearFile;
      result = inputParams.data.result;
      return <div>Hello</div>;
    };
    render(
      <ParseCsv parseErrorMessage="Parsing Error" render={renderFunction} />
    );

    setFile({
      data: `column 1, column 2
      value 1, value 2`,
      columns: [
        {
          name: 'column 1',
          validators: [validators.isString, validators.isNotEmpty],
        },
        {
          name: 'column 2',
          validators: [validators.isString, validators.isNotEmpty],
        },
      ],
      header: true,
      maxRows: 2,
    });
    await wait(() => expect(result.length).toBe(1));
    clearFile();
    expect(result.length).toBe(0);
  });

  it('sets the error if parsing failed', async () => {
    let setFile: Function = () => null;
    let errors: Array<any> = [];
    const renderFunction = (inputParams: RenderProps) => {
      setFile = inputParams.setFile;
      errors = inputParams.data.errors;
      return <div>Hello</div>;
    };
    render(
      <ParseCsv parseErrorMessage="Parsing Error" render={renderFunction} />
    );

    setFile({
      data: null,
      columns: [],
    });
    await wait(() => expect(errors[0]).toBe('Parsing Error'));
  });
});
