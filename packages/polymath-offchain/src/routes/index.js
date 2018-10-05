// @flow

import Router from 'koa-router';
import { authRouter } from './auth';
import { emailRouter } from './email';
import { providersRouter } from './providers';
import { noticeRouter } from './notice';

const router = new Router();

router.use(authRouter.routes());
router.use(emailRouter.routes());
router.use(providersRouter.routes());
router.use(noticeRouter.routes());

export { router };
