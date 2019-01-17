import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from '~/App';
import * as pages from '~/pages';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);

export { pages };