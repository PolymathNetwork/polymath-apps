import React, { Component } from 'react';
import { Foo } from './components/test-module';
export { Foo };

export class ImportedTestComponent extends Component<{ text: string }> {
  public render() {
    return <p>{this.props.text}</p>;
  }
}
