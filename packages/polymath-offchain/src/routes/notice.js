// @flow

import Router from 'koa-router';

import { Notice } from '../models';

import type { Context } from 'koa';

const noticeRouter = new Router();

type GetNoticesRequestParams = {|
  scope: string,
|};

/**
 * Validates that the request parameters are typed correctly
 *
 * TODO @monitz87: add value validations as well
 */
const isGetNoticesRequestValid = (
  params: GetNoticesRequestParams | any
): boolean => {
  if (typeof params !== 'object') {
    return false;
  }

  const { scope } = params;

  return !!scope && typeof scope === 'string';
};

/**
 * GET /notice/:scope
 *
 * Latest notice route handler. Given a scope string (issuer | investor), the route responds with the latest notice in that scope.
 * Notices with 'all' scope are returned even if they are not requested.
 *
 * If the scope is invalid, the response is
 *
 * {
 *   status: 'error',
 *   data: 'Invalid request parameters'
 * }
 *
 * If there is no valid notice in the database, the response is
 *
 * {
 *   status: 'ok',
 *   data: undefined
 * }
 *
 * Otherwise, the response is
 *
 * {
 *   status: 'ok',
 *   data: {
 *     type: string, // notice type (error, warning, info)
 *     scope: string, // notice scope (all, issuers, investors)
 *     title: string, // notice title
 *     content: string, // notice content
 *     isOneTime: boolean, // whether the notice should only be shown once to the client
 *     isValid: boolean, // whether to show the notice
 *     createdAt: Date, // when the notice was created
 *     updatedAt: Date // when the notice was last updated
 *   }
 * }
 */
export const getNoticesHandler = async (ctx: Context) => {
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
 * Latest notice route
 */
noticeRouter.get('/notice/:scope', getNoticesHandler);

export { noticeRouter };
