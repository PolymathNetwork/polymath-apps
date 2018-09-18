// @flow
import App from './app/App';
import NotFoundPage from './app/NotFoundPage';
import STOPage from './app/sto/STOPage';

export default [
  {
    component: App,
    routes: [
      {
        path: '/:ticker?',
        component: STOPage,
        exact: true,
      },
      {
        component: NotFoundPage,
      },
    ],
  },
];
