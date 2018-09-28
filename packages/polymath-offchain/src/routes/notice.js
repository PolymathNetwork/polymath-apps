import Router from 'koa-router';

import { Notice } from '../models';

import type { Context } from 'koa';

const noticeRouter = new Router();

type GetNoticesRequestParams = {|
  scope: string,
|};

/**
  Validates that the request parameters are typed correctly

  TODO @monitz87: add value validations as well
 */
const isGetNoticesRequestValid = (params: GetNoticesRequestParams | any) => {
  if (typeof params !== 'object') {
    return false;
  }

  const { scope } = params;

  return scope && typeof scope === 'string';
};

/**
  GET /notice/:scope

  Latest notice route handler. Given a scope (issuer | investor), 
  the route responds with the latest notice in that scope. Notices with 
  'all' scope are returned even if they are not requested

  @param {string} scope scope of the requested notice
 */
const getNoticesHandler = async (ctx: Context) => {
  let { params } = ctx;

  if (!isGetNoticesRequestValid(params)) {
    ctx.body = {
      status: 'error',
      data: 'Invalid request parameters',
    };
    return;
  }

  params = (params: GetNoticesRequestParams);

  const { scope } = params;

  const notice = await Notice.findOne({
    $or: [{ scope: scope.toLowerCase() }, { scope: 'all' }],
    isValid: true,
  }).sort({ createdAt: -1 });

  ctx.body = {
    status: 'ok',
    data: notice,
  };
};

/**
  Latest notice route
 */
noticeRouter.get('/notice/:scope', getNoticesHandler);

export { noticeRouter };
