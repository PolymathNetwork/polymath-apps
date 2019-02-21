import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from 'react-testing-library';
import { ParseCsv, RenderProps } from '../ParseCsv';

afterEach(cleanup);

const mockRenderProps = {
  clearFile: Function,
  data: {
    errorRows: 0,
    errors: [],
    ignoredRows: 0,
    isFileValid: false,
    result: [],
    totalRows: 0,
    validRows: 0,
  },
  setFile: Function,
};

describe('ParseCsv component', () => {
  it('srenders the child component', () => {
    const renderMock = jest.fn(() => {
      return <div>Hello</div>;
    });
    render(<ParseCsv render={renderMock} />);
    expect(renderMock).toHaveBeenCalled();
  });
});
