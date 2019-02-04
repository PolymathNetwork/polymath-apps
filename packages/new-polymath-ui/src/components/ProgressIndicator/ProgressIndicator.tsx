import React from 'react';
import { Step } from './Step';
import * as sc from './styles';

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

export class ProgressIndicator extends React.Component<Props> {
  public static Step = Step;

  public renderSteps = () => {
    const { vertical, ordered } = this.props;

    return React.Children.map(this.props.children, (child, index) => {
      const childProps = {
        index,
        isVertical: vertical,
        isOrdered: ordered,
        isCurrent: false,
        isComplete: false,
      };

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
    return <sc.Container {...otherProps}>{this.renderSteps()}</sc.Container>;
  }
}
