import React, { Component } from 'react';

import * as sc from './styles';

interface TextEllipsisProps {
  ellipsedChars: number;
}

export class TextEllipsis extends Component<TextEllipsisProps> {
  public elRef: React.RefObject<HTMLSpanElement> = React.createRef();

  componentDidMount() {
    if (!this.elRef.current || !this.elRef.current.textContent) {
      return;
    }

    if (this.elRef.current.offsetWidth < this.elRef.current.scrollWidth) {
      var text = this.elRef.current.textContent;
      this.elRef.current.dataset.tail = text.slice(
        text.length - this.props.ellipsedChars
      );
    }
  }

  public render() {
    const { children, ellipsedChars, ...rest } = this.props;

    return (
      <sc.Wrapper ref={this.elRef} {...rest}>
        {children}
      </sc.Wrapper>
    );
  }
}
