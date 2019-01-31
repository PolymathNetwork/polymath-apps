import React, { Fragment, ComponentType } from 'react';
import { findDOMNode } from 'react-dom';
import PopperJS from 'popper.js';
import TooltipJS, { Options } from 'tooltip.js';
import { styled } from '~/styles';
import * as sc from './styles';

export interface TooltipProps {
  role?: string;
  placement?: PopperJS.Placement;
  children: ComponentType;
}

class TooltipComponent extends React.Component<TooltipProps> {
  private popper?: TooltipJS;

  public getOptions = (): Options => {
    const { placement } = this.props;
    const popover = this.getPopover() as HTMLElement;

    return {
      placement,
      title: popover,
      html: true,
      boundariesElement: document.body,
    };
  };

  public initPopper = () => {
    if (!this.popper) {
      const popover = this.getPopover();
      const parentNode = popover.parentNode as HTMLElement;

      if (parentNode && getComputedStyle(parentNode).display !== 'none') {
        this.popper = new TooltipJS(parentNode, this.getOptions());
      }
    }
  };

  public destroyPopper = () => {
    if (this.popper) {
      this.popper.dispose();
      this.popper = undefined;
    }
  };

  public componentDidMount() {
    this.initPopper();
  }

  public componentWillUnmount() {
    this.destroyPopper();
  }

  public componentDidUpdate(
    prevProps: TooltipProps & Readonly<{ children?: React.ReactNode }>
  ) {
    if (
      prevProps.placement !== this.props.placement ||
      prevProps.children !== this.props.children
    ) {
      this.destroyPopper();
      this.initPopper();
    }
  }

  public render() {
    return (
      <Fragment>
        <sc.GlobalStyles />
        <div {...this.props} />
      </Fragment>
    );
  }

  private getPopover = () => findDOMNode(this) as NodeSelector & Node & Element;
}

export const Tooltip = styled(TooltipComponent)`
  user-select: auto;
  cursor: auto;
  display: none;

  .tooltip & {
    display: block;
  }
`;

Tooltip.defaultProps = {
  role: 'group',
  placement: 'top',
};
