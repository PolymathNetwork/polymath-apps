import Router from 'koa-router';

import Notice from '../models/Notice';

const router = new Router();

router.get('/notice/:scope', async ctx => {
  ctx.body = {
    status: 'ok',
    data: await Notice.findOne({
      $or: [{ scope: ctx.params.scope.toLowerCase() }, { scope: 'all' }],
      isValid: true,
    }).sort({ createdAt: 'desc' }),
  };
});

export default router;
