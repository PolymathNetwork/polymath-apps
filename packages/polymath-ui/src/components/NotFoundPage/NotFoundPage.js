// @flow

import React, { Component } from 'react';

import PageCentered from '../PageCentered';
import ContentBox from '../ContentBox';
import Heading from '../Heading';

export default class NotFoundPage extends Component<{}> {
  render() {
    return (
      <PageCentered title="Sign In – Polymath">
        <ContentBox maxWidth={735}>
          <Heading as="h1" variant="h1" textAlign="center">
            Page not found
          </Heading>
          <Heading as="h2" variant="h4" textAlign="center">
            Please visit{' '}
            <a href="https://tokenstudio.polymath.network/">
              tokenstudio.polymath.network
            </a>{' '}
            to sign in or to get started.
          </Heading>
        </ContentBox>
      </PageCentered>
    );
  }
}
