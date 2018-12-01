import { ImportedTestComponent } from '@polymathnetwork/new-ui';
import { Foo } from '@polymathnetwork/new-ui';
import React, { Component, Fragment } from 'react';
const a = Foo;
export class TestComponent extends Component<{ text: string }> {
  public render() {
    return (
      <Fragment>
        <p>{this.props.text}</p>
        <ImportedTestComponent text={'I AM NOT FROM AROUND HERE'} />
      </Fragment>
    );
  }
}
