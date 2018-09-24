// @flow

import Router from 'koa-router';
import { authRouter } from './auth';
// import email from './email';
// import providers from './providers';
// import notice from './notice';

const router = new Router();

router.use(authRouter.routes());
// router.use(email.routes());
// router.use(providers.routes());
// router.use(notice.routes());

export { router };
