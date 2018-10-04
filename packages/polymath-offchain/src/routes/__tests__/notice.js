import { getNoticesHandler } from '../notice';
import { Notice } from '../../models';

jest.mock('../../models/Notice', () => {
  return {
    Notice: {
      findOne: jest.fn(),
    },
  };
});

const generateInvalidRequestParametersTest = body => {
  return async () => {
    const ctx = {
      request: {
        body,
      },
    };

    await getNoticesHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Invalid request parameters',
    });
  };
};

describe('Route: GET /notice/:scope', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const validScope = 'some-scope';

  test(
    'responds with an error if params is not an object',
    generateInvalidRequestParametersTest(1)
  );

  test(
    'responds with an error if scope is not a string',
    generateInvalidRequestParametersTest({
      params: {
        scope: 1,
      },
    })
  );

  test('responds with empty data if there are no valid notices in the database', async () => {
    Notice.findOne.mockImplementationOnce(() => {
      return {
        sort: () => undefined,
      };
    });

    const ctx = {
      params: {
        scope: validScope,
      },
    };

    await getNoticesHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: undefined,
    });
  });

  test('responds with notice data if there is a valid notice in the database', async () => {
    const validNotice = {
      type: 'Some type',
      scope: validScope,
      title: 'Some title',
      content: 'Some content',
      isOneTime: false,
      isValid: true,
      createdAt: new Date(0),
      updatedAt: new Date(0),
    };

    Notice.findOne.mockImplementationOnce(() => {
      return {
        sort: () => validNotice,
      };
    });

    const ctx = {
      params: {
        scope: validScope,
      },
    };

    await getNoticesHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'ok',
      data: validNotice,
    });
  });
});
