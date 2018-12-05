// @flow

import React, { Component } from 'react';
import styled, { withTheme } from 'styled-components';

import theme from '../../styles/theme';

import Block from '../Block';

type Props = {|
  className: string,
  progress: number,
  style: {},
  height: number,
  backgroundColor: string,
  color: string,
|};

const Container = styled.svg`
  display: block;
`;

class ProgressBar extends Component<Props> {
  static defaultProps = {
    progress: 0,
    height: 16,
    backgroundColor: theme.colors.gray[1],
    color: theme.colors.secondary,
  };

  render() {
    const { progress, height, backgroundColor, color } = this.props;

    return (
      <Container className="pui-progress-bar" width="100%" height={height}>
        <rect
          className="pui-progress-bar-trail"
          fill={backgroundColor}
          x=".5"
          y=".5"
          rx={height / 2}
          width="100%"
        />
        <rect
          className="pui-progress-bar-path"
          fill={color}
          x=".5"
          y=".5"
          rx={height / 2}
          width={`${progress}%`}
        />
      </Container>
    );
  }
}

export default withTheme(ProgressBar);
