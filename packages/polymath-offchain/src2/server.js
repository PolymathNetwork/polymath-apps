// @flow

import './startup';

import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import cors from '@koa/cors';
import Ddos from 'ddos';

import router from './routes/router';

const ddos = new Ddos();

// noinspection JSUnusedGlobalSymbols
const app = new Koa();
app
  .use(cors())
  .use(koaBody())
  .use(koaStatic('.'))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(ddos.koa().bind(ddos));
