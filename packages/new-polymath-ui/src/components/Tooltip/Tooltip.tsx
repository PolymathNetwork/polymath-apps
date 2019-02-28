import React, { Fragment } from 'react';
import { findDOMNode } from 'react-dom';
import PopperJS from 'popper.js';
import TooltipJS, { Options } from 'tooltip.js';
import { styled } from '~/styles';
import * as sc from './styles';

export interface TooltipProps {
  role?: string;
  placement?: PopperJS.Placement;
}

export class TooltipComponent extends React.Component<TooltipProps> {
  public static defaultProps = {
    role: 'group',
    placement: 'top',
  };

  private popper?: TooltipJS;

  public getOptions = (): Options => {
    const { placement } = this.props;
    const popover = this.getPopover() as HTMLElement;

    return {
      placement,
      title: popover,
      html: true,
      container: document.body,
      popperOptions: {
        modifiers: {
          setState: {
            enabled: true,
            order: 800,
            fn: this.modifier,
          },
        },
      },
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
        {<div {...this.props} />}
      </Fragment>
    );
  }

  private getPopover = () => findDOMNode(this) as NodeSelector & Node & Element;

  private modifier = (data: PopperJS.Data) => {
    data.arrowStyles.color = getComputedStyle(
      this.getPopover()
    ).backgroundColor;
    return data;
  };
}

export const Tooltip = styled(TooltipComponent)<TooltipProps>`
  user-select: auto;
  cursor: auto;
  display: none;

  .tooltip & {
    display: block;
  }
`;
