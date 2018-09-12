// @flow

import React, { Component } from 'react';
import Measure from 'react-measure';

// TODO @bshevchenko: extract following styles into the scss file
const backgroundColor = '#F0F3F6';
const strokeColor = '#3D70B2';
const strokeWidth = 16;

type Props = {|
  className: string,
  progress: number,
  style: {},
|};

type State = {|
  width: number,
|};

export default class ProgressBar extends Component<Props, State> {
  static defaultProps = {
    className: '',
    progress: 0,
    style: {},
  };

  state = {
    width: 0,
  };

  handleResize = (contentRect: any) => {
    this.setState({ width: contentRect.bounds.width });
  };

  render() {
    const { className, progress, style } = this.props;
    const width = this.state.width;

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
            <svg
              className={`pui-progress-bar ${className}`}
              style={style}
              viewBox={viewBox}
            >
              <path
                className="pui-progress-bar-trail"
                d={pathString}
                strokeLinecap="round"
                stroke={backgroundColor}
                strokeWidth={strokeWidth}
                fillOpacity="0"
              />
              <path
                className="pui-progress-bar-path"
                d={pathString}
                strokeLinecap="round"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fillOpacity="0"
                style={pathStyle}
              />
            </svg>
          </div>
        )}
      </Measure>
    );
  }
}
