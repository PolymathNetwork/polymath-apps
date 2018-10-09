import React from 'react';
import renderer from 'react-test-renderer';
import { EmailWrapper, EtherscanURL } from '../EmailWrapper';

describe('Component: EmailWrapper', () => {
  test('renders with no children', () => {
    const component = renderer.create(<EmailWrapper />);
    let tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders with children', () => {
    const component = renderer.create(
      <EmailWrapper>
        <h1>This is dummy text</h1>
      </EmailWrapper>
    );
    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});

describe('Component: EtherscanURL', () => {
  const hash = '0xffffffffffff';

  test('renders transaction url', () => {
    const component = renderer.create(<EtherscanURL type={'tx'} hash={hash} />);

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });

  test('renders non-transaction url', () => {
    const component = renderer.create(<EtherscanURL type={''} hash={hash} />);

    const tree = component.toJSON();

    expect(tree).toMatchSnapshot();
  });
});
