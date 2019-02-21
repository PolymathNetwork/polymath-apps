import React, { Fragment } from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from '~/styles';

const customRender = (node: React.ReactElement<any>, ...opts: any[]) => {
  const { rerender, ...result } = render(
    <ThemeProvider>{node}</ThemeProvider>,
    ...opts
  );

  const customRerender = (rerenderNode: React.ReactElement<any>) => {
    return rerender(<Fragment>{rerenderNode}</Fragment>);
  };

  return { rerender: customRerender, ...result };
};

export * from 'react-testing-library';
export { customRender as render };
