import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import { TestComponent } from './export-test';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

// console.log('PREIMPORTED COMPONENT!!!', TestComponent);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

export { TestComponent };
