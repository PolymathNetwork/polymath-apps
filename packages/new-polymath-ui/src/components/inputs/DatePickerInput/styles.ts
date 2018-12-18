import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .flatpickr-calendar {
    background: transparent;
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    visibility: hidden;
    text-align: center;
    padding: 0;
    -webkit-animation: none;
    animation: none;
    direction: ltr;
    border: 0;
    font-size: 14px;
    line-height: 24px;
    border-radius: 5px;
    position: absolute;
    width: 315px;
    box-sizing: border-box;
    touch-action: manipulation;
    background: #fff;
    box-shadow: 1px 0 0 #e6e6e6, -1px 0 0 #e6e6e6, 0 1px 0 #e6e6e6,
      0 -1px 0 #e6e6e6, 0 3px 13px rgba(0, 0, 0, 0.08);

    &.open {
      opacity: 1;
      visibility: visible;
      overflow: visible;
      max-height: 640px;
      box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.1);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1rem 1rem 0.25rem;
      width: 17.8125rem !important;
      height: 16.375rem;
      border-radius: 0;
      border: none;
      overflow: hidden;
      margin-top: 1px;

      &.animate {
        cubic-bezier(0.23, 1, 0.32, 1);
        animation: fpFadeInDown 300ms cubic-bezier(0.23, 1, 0.32, 1);
      }
    }

    .flatpickr-months {
      display: flex;
      width: 100%;
      position: relative;
    }

    .flatpickr-month {
      background: transparent;
      color: rgba(0, 0, 0, 0.9);
      fill: rgba(0, 0, 0, 0.9);
      height: 28px;
      line-height: 1;
      text-align: center;
      position: relative;
      width: 100%;
      margin-bottom: 0.25rem;
    }

    .flatpickr-prev-month, 
    .flatpickr-next-month {
      box-sizing: border-box;
      text-decoration: none;
      cursor: pointer;
      position: absolute;
      top: 0px;
      line-height: 16px;
      height: 28px;
      padding: 10px calc(3.57% - 1.5px);
      padding-top: 5px;
      z-index: 3;

      &:hover {
        fill: ${({ theme }) => theme.colors.secondary};
      }
    }

    .flatpickr-prev-month.flatpickr-prev-month, 
    .flatpickr-next-month.flatpickr-prev-month {
      left: 0;
    }

    .flatpickr-prev-month.flatpickr-next-month, 
    .flatpickr-next-month.flatpickr-next-month {
      right: 0;
    }

    .flatpickr-weekdays {
      background: transparent;
      text-align: center;
      overflow: hidden;
      display: flex;
      align-items: center;
      height: 28px;
      width: 14.0625rem;
      margin-bottom: 0.25rem;
    }

    .flatpickr-days {
      position: relative;
      overflow: hidden;
      display: flex;
      width: 14.0625rem;
      min-width: 14.0625rem;
      max-width: 14.0625rem;
      height: 10.25rem;
    }

    .flatpickr-day {
      font-size: 0.75rem;
      height: 1.5625rem;
      width: 1.8rem;
      line-height: 1.5625rem;
      flex-basis: 1.8rem;
      max-width: 1.8rem;
      margin: 0.03125rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #152935;
      border: 2px solid transparent;
      box-sizing: border-box;
      color: #152935;
      cursor: pointer;
      font-weight: 400;
      position: relative;
      text-align: center;

      &:hover {
        background: rgba(85, 150, 230, 0.1);
      }

      &.disabled,
      &.prevMonthDay,
      &.nextMonthDay {
        opacity: 0.5;
        color: #5a6872;
      }

      &.disabled {
        cursor: not-allowed;

        &:hover {
          background: transparent;
        }
      }

      &.today:after {
        content: '';
        position: absolute;
        display: block;
        top: 90%;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        height: 3px;
        width: 3px;
        border-radius: 50%;
        background: ${({ theme }) => theme.colors.secondary};
      }

      &.selected {
        border: 2px solid ${({ theme }) => theme.colors.secondary};
        background: #fff;
      }
    }

    .dayContainer {
      padding: 0;
      outline: 0;
      text-align: left;
      box-sizing: border-box;
      display: inline-block;
      display: flex;
      flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      justify-content: space-around;
      -webkit-transform: translate3d(0px, 0px, 0px);
      transform: translate3d(0px, 0px, 0px);
      opacity: 1;
      width: 14.0625rem;
      min-width: 14.0625rem;
      max-width: 14.0625rem;
      height: 10.25rem;
    }

    .flatpickr-current-month {
      font-size: 135%;
      line-height: inherit;
      font-weight: 300;
      color: inherit;
      position: absolute;
      width: 75%;
      left: 12.5%;
      padding: 6.16px 0 0 0;
      line-height: 1;
      height: 28px;
      display: inline-block;
      text-align: center;
      -webkit-transform: translate3d(0px, 0px, 0px);
      transform: translate3d(0px, 0px, 0px);

      span.cur-month {
        font-family: inherit;
        font-weight: 600;
        color: inherit;
        display: inline-block;
        margin-left: 0.5ch;
        margin-right: 0.25rem;
        padding: 0;
        color: #152935;
      }
    }

    .flatpickr-month .flatpickr-current-month {
      font-size: 0.75rem;
      text-transform: uppercase;
      padding: 0;
      position: absolute;
      width: 75%;
      left: 12.5%;

      span {
        font-family: inherit;
        font-weight: 600;
        color: inherit;
        display: inline-block;
        margin-left: 0.5ch;
        padding: 0;
      }
    }

    .numInputWrapper {
      position: relative;
      height: auto;
      display: inline-block;
      min-width: 2.375rem;
      width: 2.375rem;

      &:hover span {
        opacity: 1;
      }

      span {
        position: absolute;
        right: 0;
        width: 0.75rem;
        padding: 0 4px 0 2px;
        height: 50%;
        line-height: 50%;
        opacity: 0;
        cursor: pointer;
        border: 1px solid rgba(57, 57, 57, 0.05);
        box-sizing: border-box;

        &.arrowDown {
          left: 2.6rem;
          border: none;
          width: 0.75rem;
          top: 9px;

          &:after {
            border-top: 4px solid;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
          }
        }

        &.arrowUp {
          left: 2.6rem;
          border: none;
          width: 0.75rem;
          top: 1px;

          &:after {
            border-bottom: 4px solid;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
          }
        }

        &.arrowDown:after,
        &.arrowUp:after {
          display: block;
          content: '';
          position: absolute;
          top: 33%;
          border-bottom-color: ${({ theme }) => theme.colors.secondary};
          border-top-color: ${({ theme }) => theme.colors.secondary};
        }
      }
    }

    .flatpickr-month .numInputWrapper .numInput {
      background: transparent;
      box-sizing: border-box;
      font-weight: 600;
      color: #152935;
      background-color: #f4f7fb;
      border: none;
      border-radius: 0;
      min-width: 2.375rem;
      width: 2.375rem;
      padding: 0.25rem;
      cursor: default;
      line-height: inherit;
      height: auto;
      margin: 0;
      display: inline-block;
      font-size: inherit;
      font-family: inherit;
    }

    .flatpickr-month .flatpickr-current-month span {
      font-family: inherit;
      font-weight: 600;
      color: inherit;
      display: inline-block;
      margin-left: 0.5ch;
      padding: 0;
    }

    .flatpickr-prev-month svg, 
    .flatpickr-next-month svg {
      width: 14px;
    }

    span.flatpickr-weekday {
      cursor: default;
      font-size: 90%;
      background: transparent;
      color: rgba(0, 0, 0, 0.54);
      line-height: 1;
      margin: 0;
      text-align: center;
      display: block;
      flex: 1;
      font-weight: bolder;
      font-size: 0.75rem;
      font-weight: 600;
      color: #152935;
    }

    .flatpickr-weekdaycontainer {
      display: flex;
      width: 14.0625rem;
      margin-bottom: 0.25rem;
    }
  }
`;
