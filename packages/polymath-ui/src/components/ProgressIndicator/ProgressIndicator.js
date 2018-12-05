// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Flex from '../Flex';

type Props = {
  currentIndex: number,
  className: string,
  children?: React.Node,
};

const Container = styled.ul`
  display: flex;
  list-style: none;
`;

class ProgressIndicator extends React.Component<Props> {
  static propTypes = {
    /**
     * Provide <Step> components to be rendered in the
     * <ProgressIndicator>
     */
    children: PropTypes.node,

    /**
     * Provide an optional className to be applied to the containing node
     */
    className: PropTypes.string,

    /**
     * Optionally specify the current step array index
     */
    currentIndex: PropTypes.number,
  };

  renderSteps = () =>
    React.Children.map(this.props.children, (child, index) => {
      if (index === this.props.currentIndex) {
        return React.cloneElement(child, {
          current: true,
        });
      } else if (index < this.props.currentIndex) {
        return React.cloneElement(child, {
          complete: true,
        });
      } else if (index > this.props.currentIndex) {
        return React.cloneElement(child, {
          complete: false,
        });
      }
      return null;
    });

  render() {
    const { currentIndex, ...otherProps } = this.props;
    return <Container {...otherProps}>{this.renderSteps()}</Container>;
  }
}

export default ProgressIndicator;
