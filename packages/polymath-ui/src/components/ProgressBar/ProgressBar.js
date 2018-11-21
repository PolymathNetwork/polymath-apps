// @flow

import React, { Component } from 'react';
import Measure from 'react-measure';
import { withTheme } from 'styled-components';

import Block from '../Block';

type Props = {|
  className: string,
  progress: number,
  style: {},
  height: string,
  backgroundColor: string,
  color: string,
|};

type State = {|
  width: number,
|};

class ProgressBar extends Component<Props, State> {
  static defaultProps = {
    className: '',
    progress: 0,
    style: {},
    height: 16,
    backgroundColor: ({ theme }) => theme.colors.gray[0],
    color: ({ theme }) => theme.colors.secondary,
  };

  state = {
    width: 0,
  };

  handleResize = (contentRect: any) => {
    this.setState({ width: contentRect.bounds.width });
  };

  render() {
    const { progress, style, height, backgroundColor, color } = this.props;
    const width = this.state.width;
    const strokeWidth = parseInt(height, 10);

    // noinspection SpellCheckingInspection
    const pathStyle = {
      strokeDasharray: `${width} ${width}`,
      // Draw a stroke from the beginning (the center of the rounded circle on
      // the left, strokeWidth/2 from the left edge) to the end (the center of
      // the rounded circle on the right, strokeWidth/2 from the right edge).
      strokeDashoffset: `${width * (1.0 - progress) +
        progress * strokeWidth}px`,
      // Can put transitions on the stroke-dashoffset property for neat effects.
    };

    const halfWidth = strokeWidth / 2;
    const rightEnd = width - strokeWidth / 2;
    const pathString = `M ${halfWidth},${halfWidth}
       L ${rightEnd},${halfWidth}`;
    const viewBox = `0 0 ${width} ${strokeWidth}`;

    return (
      <Measure bounds onResize={this.handleResize}>
        {({ measureRef }) => (
          <div ref={measureRef}>
            <Block
              as="svg"
              className="pui-progress-bar"
              style={style}
              viewBox={viewBox}
            >
              <path
                className="pui-progress-bar-trail"
                d={pathString}
                strokeLinecap="round"
                stroke={backgroundColor}
                strokeWidth={height}
                fillOpacity="0"
              />
              <path
                className="pui-progress-bar-path"
                d={pathString}
                strokeLinecap="round"
                stroke={color}
                strokeWidth={height}
                fillOpacity="0"
                style={pathStyle}
              />
            </Block>
          </div>
        )}
      </Measure>
    );
  }
}

export default withTheme(ProgressBar);
