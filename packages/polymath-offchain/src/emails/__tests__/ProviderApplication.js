import '../../startup/setupEnvironment';

import React from 'react';
import renderer from 'react-test-renderer';
import { ProviderApplication } from '../ProviderApplication';

describe('Component: ProviderApplication', () => {
  const companyName = 'Some company';
  const companyDesc = 'Some description';
  const operatedIn = 'Some operation jurisdiction';
  const incorporatedIn = 'Some incorporation jurisdiction';

  test('renders with all props', () => {
    const application = {
      companyName,
      companyDesc,
      operatedIn,
      incorporatedIn,
      projectURL: 'http://www.some.project.url',
      profilesURL: 'http://www.some.profiles.url',
      structureURL: 'http://www.some.stucture.url',
      otherDetails: 'Some details',
    };
    const component = renderer.create(
      <ProviderApplication
        issuerName={'Jeremías Díaz'}
        issuerEmail={'jeremias@polymath.network'}
        application={application}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders without optional props', () => {
    const application = {
      companyName,
      companyDesc,
      operatedIn,
      incorporatedIn,
    };

    const component = renderer.create(
      <ProviderApplication
        issuerName={'Jeremías Díaz'}
        issuerEmail={'jeremias@polymath.network'}
        application={application}
      />
    );
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
