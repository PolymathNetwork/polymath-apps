// @flow

import './startup';

import logger from 'winston';

import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import cors from '@koa/cors';
import Ddos from 'ddos';
import { PORT } from './constants';

import router from './routes/router';

const ddos = new Ddos();

const app = new Koa();
app
  .use(cors())
  .use(koaBody())
  .use(koaStatic('.'))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(ddos.koa().bind(ddos));

app.listen(PORT, undefined, undefined, function() {
  logger.info(`Server is listening on port ${PORT}.`);
});
