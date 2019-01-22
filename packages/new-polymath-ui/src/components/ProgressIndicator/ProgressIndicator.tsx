import React from 'react';
import styled from 'styled-components';
import { Step } from './Step';

interface Props {
  /**
   * Provide <Step> components to be rendered in the
   * <ProgressIndicator>
   */
  children?: React.ReactNode;
  /**
   * Specify the current step array index
   */
  currentIndex: number;
  vertical: boolean;
  ordered: boolean;
}

const Container = styled.ul<{ vertical: boolean }>`
  display: flex;
  list-style: none;

  ${({ vertical }) =>
    vertical
      ? `
      flex-direction: column;
      height: 100%;
      justify-content: space-between;
      `
      : `
      flex-direction: row;
      height: auto;
    `};
`;

export class ProgressIndicator extends React.Component<Props> {
  public static Step = Step;

  public renderSteps = () => {
    const { vertical, ordered } = this.props;
    const childProps = {
      vertical,
      ordered,
      index: 0,
      isCurrent: false,
      isComplete: false,
    };

    return React.Children.map(this.props.children, (child, index) => {
      childProps.index = index;

      if (!React.isValidElement(child)) {
        return null;
      }

      if (index === this.props.currentIndex) {
        childProps.isCurrent = true;
      } else if (index < this.props.currentIndex) {
        childProps.isComplete = true;
      }
      return React.cloneElement(child, childProps);
    });
  };

  public render() {
    const { currentIndex, ...otherProps } = this.props;
    return <Container {...otherProps}>{this.renderSteps()}</Container>;
  }
}
