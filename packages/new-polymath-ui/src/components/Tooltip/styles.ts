import { createGlobalStyle } from '~/styles';

const tooltipSpace = 5;
const arrowSize = 8;

export const GlobalStyles = createGlobalStyle`
  .popper,
  .tooltip {
    position: absolute;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: ${({ theme }) => theme.zIndexes.tooltips};
  }

  .popper .popper__arrow,
  .tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: ${arrowSize + tooltipSpace}px;
  }

  .tooltip .tooltip-arrow,
  .popper .popper__arrow {
    border-color: currentColor;
  }

  .popper[x-placement^="top"],
  .tooltip[x-placement^="top"] {
    margin-bottom: ${arrowSize + tooltipSpace}px;
  }

  .popper[x-placement^="top"] .popper__arrow,
  .tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: ${arrowSize}px ${arrowSize}px 0 ${arrowSize}px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    bottom: ${-arrowSize + 1}px;
    left: calc(50% - ${arrowSize}px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .popper[x-placement^="bottom"],
  .tooltip[x-placement^="bottom"] {
    margin-top: ${arrowSize + tooltipSpace}px;
  }
  .tooltip[x-placement^="bottom"] .tooltip-arrow,
  .popper[x-placement^="bottom"] .popper__arrow {
    border-width: 0 ${arrowSize}px ${arrowSize}px ${arrowSize}px;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
    top: ${-arrowSize + 1}px;
    left: calc(50% - ${arrowSize}px);
    margin-top: 0;
    margin-bottom: 0;
  }
  .tooltip[x-placement^="right"],
  .popper[x-placement^="right"] {
    margin-left: ${arrowSize + tooltipSpace}px;
  }
  .popper[x-placement^="right"] .popper__arrow,
  .tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: ${arrowSize}px ${arrowSize}px ${arrowSize}px 0;
    border-left-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
    left: ${-arrowSize + 1}px;
    top: calc(50% - ${arrowSize}px);
    margin-left: 0;
    margin-right: 0;
  }
  .popper[x-placement^="left"],
  .tooltip[x-placement^="left"] {
    margin-right: ${arrowSize + tooltipSpace}px;
  }
  .popper[x-placement^="left"] .popper__arrow,
  .tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: ${arrowSize}px 0 ${arrowSize}px ${arrowSize}px;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    right: ${-arrowSize + 1}px;
    top: calc(50% - ${arrowSize}px);
    margin-left: 0;
    margin-right: 0;
  }
`;
