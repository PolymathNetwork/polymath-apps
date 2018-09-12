// @flow

import Koa from 'koa';
import koaBody from 'koa-body';
import koaStatic from 'koa-static';
import cors from '@koa/cors';
import mongoose from 'mongoose';
import Ddos from 'ddos';
import sendGrid from '@sendgrid/mail';

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

if (!module.parent) {
  if (process.env.SENDGRID_API_KEY) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    console.warn(
      'SENDGRID_API_KEY not provided. Will log but not send emails.'
    );
  }

  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', err => {
    console.error('Could not connect to the database. Exiting.', err);
    process.exit();
  });

  mongoose.connection.once('open', function() {
    console.log('Successfully connected to the database');
  });

  mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost');

  const port = process.env.PORT || 3001;

  app.listen(port, function() {
    console.log(`Server is listening on port ${port}.`);
  });
}

// noinspection JSUnusedGlobalSymbols
export default app;
