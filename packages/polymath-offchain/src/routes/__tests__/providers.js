import '../../startup/setupEnvironment';

import Web3 from 'web3';
import { User } from '../../models';
import { verifySignature } from '../../utils';
import { applyHandler } from '../providers';

jest.mock('web3');

jest.mock('../../models/User', () => {
  return {
    User: {
      findOne: jest.fn(),
    },
  };
});

jest.mock('../../models/Provider', () => {
  return {
    Provider: {
      find: jest.fn(),
    },
  };
});

jest.mock('../../utils', () => {
  return {
    sendProviderApplicationEmail: jest.fn(),
    verifySignature: jest.fn(),
  };
});

jest.mock(
  '@polymathnetwork/shared/fixtures/contracts/TickerRegistry.json',
  () => {
    return {
      abi: {},
      networks: {
        '15': {
          address: '0xffffffffffffffffffffffffffffffffffffffff',
        },
      },
    };
  }
);

describe('Route: POST /providers/apply', () => {
  const generateInvalidRequestBodyTest = body => {
    return async () => {
      const ctx = {
        request: {
          body,
        },
      };

      await applyHandler(ctx);

      expect(ctx.body).toEqual({
        status: 'error',
        data: 'Invalid request body',
      });
    };
  };

  const validAddress = '0xf55bcAA8a8AcF4aBA2edF74A50509358B96155b0';
  const validCode = 'c2dccbea5e17e2b4';
  const validSig =
    '0xc69e7dbed9982c5b68663824e346ab5d52f60265474bc21d4c82b77f01884cca225adc4299e18446509ede2c29c939da32e29230e239e92fbf88de7caff849231c';
  const validCompanyName = 'Some Company Name';
  const validIds = [1, 2, 3, 4];
  const validCompanyDesc = 'Some company description';
  const validOperatedIn = 'Some operation jurisdiction';
  const validIncorporatedIn = 'Some incorporation jurisdiction';
  const validProjectURL = 'http://www.some.project.url';
  const validProfilesURL = 'http://www.some.profiles.url';
  const validStructureURL = 'http://www.some.structure.url';
  const validOtherDetails = 'Some details';

  const validBody = {
    code: validCode,
    sig: validSig,
    address: validAddress,
    companyName: validCompanyName,
    ids: validIds,
    companyDesc: validCompanyDesc,
    operatedIn: validOperatedIn,
    incorporatedIn: validIncorporatedIn,
    projectURL: validProjectURL,
    profilesURL: validProfilesURL,
    structureURL: validStructureURL,
    otherDetails: validOtherDetails,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test(
    'responds with an error if the request body is not an object',
    generateInvalidRequestBodyTest(1)
  );

  test(
    'responds with an error if code is not a string',
    generateInvalidRequestBodyTest({
      code: 1,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if sig is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: 1,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if address is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: 1,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if companyName is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: 1,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if ids is not an array',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: 1,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if companyDesc is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: 1,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if operatedIn is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: 1,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if incorporatedIn is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: 1,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if projectURL is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: 1,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if profilesURL is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: 1,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if structureURL is not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: 1,
      otherDetails: validOtherDetails,
    })
  );

  test(
    'responds with an error if otherDetails is present but not a string',
    generateInvalidRequestBodyTest({
      code: validCode,
      sig: validSig,
      address: validAddress,
      companyName: validCompanyName,
      ids: validIds,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: 1,
    })
  );

  test("responds with an error if signature can't be verified", async () => {
    const expectedError = {
      status: 'error',
      data: 'Some signing error',
    };

    verifySignature.mockImplementation(() => expectedError);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await applyHandler(ctx);

    expect(ctx.body).toEqual(expectedError);
  });

  const returnNull = () => null;

  test('responds with an error if the user does not exist in the database', async () => {
    User.findOne.mockImplementation(() => undefined);

    verifySignature.mockImplementation(returnNull);

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await applyHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'Invalid user',
    });
  });

  const validEmail = 'jeremias@polymath.network';
  const validName = 'Jeremías Díaz';
  const validUser = {
    address: validAddress,
    email: validEmail,
    name: validName,
  };

  const returnValidUser = () => validUser;

  test('responds with an error if the user has no reserved tickers', async () => {
    User.findOne.mockImplementation(returnValidUser);

    verifySignature.mockImplementation(returnNull);

    Web3.mockImplementation(() => {
      return {
        eth: {
          net: {
            getId: () => '15',
          },
          Contract: () => {
            return {
              getPastEvents: () => [],
            };
          },
        },
      };
    });

    const ctx = {
      request: {
        body: validBody,
      },
    };

    await applyHandler(ctx);

    expect(ctx.body).toEqual({
      status: 'error',
      data: 'No ticker was reserved',
    });
  });

  test('sends dummy email and responds with ok status in local', async () => {
    /**
      FIXME @monitz87:
      In order to test the handler with NODE_ENV mocked as both 'PRODUCTION' and 'LOCAL',
      we must reset the module cache and require the handler again. Since the reset appears to 
      also reset the mock implementations, we must require all the modules again. This is a horrible hack 
      and I sincerely hope there is a better way of doing it, but right now 100% coverage is king. 
     */
    const requireModules = () => {
      jest.resetModules();
      return {
        User: require('../../models').User,
        Provider: require('../../models').Provider,
        verifySignature: require('../../utils').verifySignature,
        Web3: require('web3'),
        applyHandler: require('../providers').applyHandler,
        sendProviderApplicationEmail: require('../../utils')
          .sendProviderApplicationEmail,
      };
    };

    const returnMockWeb3Client = () => {
      return {
        eth: {
          net: {
            getId: () => '15',
          },
          Contract: () => {
            return {
              getPastEvents: () => ['Some random event'],
            };
          },
        },
      };
    };

    const expectedResponse = {
      status: 'ok',
      data: 'Application has been sent',
    };

    const validApplication = {
      companyName: validCompanyName,
      companyDesc: validCompanyDesc,
      operatedIn: validOperatedIn,
      incorporatedIn: validIncorporatedIn,
      projectURL: validProjectURL,
      profilesURL: validProfilesURL,
      structureURL: validStructureURL,
      otherDetails: validOtherDetails,
    };

    const expectedProvider1 = {
      name: 'Some name 1',
      email: 'some@email1.com',
    };

    const expectedProvider2 = {
      name: 'Some name 2',
      email: 'some@email2.com',
    };

    const expectedProvider3 = {
      name: 'Some name 3',
      email: 'some@email3.com',
    };

    const expectedProvider4 = {
      name: 'Some name 4',
      email: 'some@email4.com',
    };

    const expectedProviders = [
      expectedProvider1,
      expectedProvider2,
      expectedProvider3,
      expectedProvider4,
    ];

    // Prevent hoisting
    jest.mock('../../constants', () => {
      return {
        NODE_ENV: 'PRODUCTION',
      };
    });

    let modules = requireModules();

    modules.User.findOne.mockImplementation(returnValidUser);

    modules.Provider.find.mockImplementation(() => expectedProviders);

    modules.verifySignature.mockImplementation(returnNull);

    modules.Web3.mockImplementation(returnMockWeb3Client);

    let ctx = {
      request: {
        body: validBody,
      },
    };

    await modules.applyHandler(ctx);

    expect(modules.sendProviderApplicationEmail).toHaveBeenCalledTimes(4);
    expect(modules.sendProviderApplicationEmail).toHaveBeenLastCalledWith(
      expectedProvider4.email,
      expectedProvider4.name,
      validName,
      validEmail,
      validApplication
    );
    expect(ctx.body).toEqual(expectedResponse);

    ctx = {
      request: {
        body: validBody,
      },
    };

    // Prevent hoisting
    jest.doMock('../../constants', () => {
      return {
        NODE_ENV: 'LOCAL',
      };
    });

    modules = requireModules();

    modules.User.findOne.mockImplementation(returnValidUser);

    modules.Provider.find.mockImplementation(() => expectedProviders);

    modules.verifySignature.mockImplementation(returnNull);

    modules.Web3.mockImplementation(returnMockWeb3Client);

    await modules.applyHandler(ctx);

    expect(modules.sendProviderApplicationEmail).toHaveBeenLastCalledWith(
      validEmail,
      validName,
      validName,
      validEmail,
      validApplication
    );

    expect(ctx.body).toEqual(expectedResponse);
  });
});
