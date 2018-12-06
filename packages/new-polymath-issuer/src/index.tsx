import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '~/App';
import startup from '~/startup';

startup()
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
  })
  .catch((error: Error) => {
    throw error;
  });
