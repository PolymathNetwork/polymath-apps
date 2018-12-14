import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import moment from 'moment-timezone';
import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n/index';

import { BaseInput } from '../BaseInput';

type PickerValue = [Date, string];

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

    .flatpickr-prev-month, .flatpickr-next-month {
      text-decoration: none;
      cursor: pointer;
      position: absolute;
      top: 0px;
      line-height: 16px;
      height: 28px;
      padding: 10px calc(3.57% - 1.5px);
      z-index: 3;
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
      border-radius: 0;
      border: 2px solid transparent;
      background: none;
      border: 1px solid transparent;
      border-radius: 150px;
      box-sizing: border-box;
      color: #152935;
      cursor: pointer;
      font-weight: 400;
      position: relative;
      text-align: center;

      &.disabled,
      &.prevMonthDay,
      &.nextMonthDay {
        opacity: 0.5;
        color: #5a6872;
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
        background: #3d70b2;
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
          border-bottom-color: #3d70b2;
          border-top-color: #3d70b2;
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

const Input = styled.input``;

// Weekdays shorthand for english locale
l10n.en.weekdays.shorthand.forEach((day, index) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

export class DatePickerInput extends Component {
  static propTypes = {
    /**
     * The child nodes.
     */
    children: PropTypes.node,

    /**
     * The date format.
     */
    dateFormat: PropTypes.string,

    /**
     *  The language locale used to format the days of the week, months, and numbers.
     *
     * * `ar` - Arabic
     * * `at` - Austria
     * * `be` - Belarusian
     * * `bg` - Bulgarian
     * * `bn` - Bangla
     * * `cat` - Catalan
     * * `cs` - Czech
     * * `cy` - Welsh
     * * `da` - Danish
     * * `de` - German
     * * `en` - English
     * * `eo` - Esperanto
     * * `es` - Spanish
     * * `et` - Estonian
     * * `fa` - Persian
     * * `fi` - Finnish
     * * `fr` - French
     * * `gr` - Greek
     * * `he` - Hebrew
     * * `hi` - Hindi
     * * `hr` - Croatian
     * * `hu` - Hungarian
     * * `id` - Indonesian
     * * `it` - Italian
     * * `ja` - Japanese
     * * `ko` - Korean
     * * `lt` - Lithuanian
     * * `lv` - Latvian
     * * `mk` - Macedonian
     * * `mn` - Mongolian
     * * `ms` - Malaysian
     * * `my` - Burmese
     * * `nl` - Dutch
     * * `no` - Norwegian
     * * `pa` - Punjabi
     * * `pl` - Polish
     * * `pt` - Portuguese
     * * `ro` - Romanian
     * * `si` - Sinhala
     * * `sk` - Slovak
     * * `sl` - Slovenian
     * * `sq` - Albanian
     * * `sr` - Serbian
     * * `sv` - Swedish
     * * `th` - Thai
     * * `tr` - Turkish
     * * `uk` - Ukrainian
     * * `vn` - Vietnamese
     * * `zh` - Mandarin
     */
    locale: PropTypes.oneOf([
      'ar',
      'at',
      'be',
      'bg',
      'bn',
      'cat',
      'cs',
      'cy',
      'da',
      'de',
      'en',
      'en',
      'eo',
      'es',
      'et',
      'fa',
      'fi',
      'fr',
      'gr',
      'he',
      'hi',
      'hr',
      'hu',
      'id',
      'it',
      'ja',
      'ko',
      'lt',
      'lv',
      'mk',
      'mn',
      'ms',
      'my',
      'nl',
      'no',
      'pa',
      'pl',
      'pt',
      'ro',
      'ru',
      'si',
      'sk',
      'sl',
      'sq',
      'sr',
      'sv',
      'th',
      'tr',
      'uk',
      'vn',
      'zh',
    ]),

    /**
     * The value of the date value provided to flatpickr, could
     * be a date, a date number, a date string, an array of dates.
     */
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.object,
        ])
      ),
      PropTypes.object,
      PropTypes.number,
    ]),

    /**
     * The DOM element or selector the Flatpicker should be inserted into. `<body>` by default.
     */
    appendTo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

    /**
     * The `change` event handler.
     */
    onChange: PropTypes.func,

    /**
     * The minimum date that a user can start picking from.
     */
    minDate: PropTypes.string,

    /**
     * The maximum date that a user can pick to.
     */
    maxDate: PropTypes.string,
  };

  static defaultProps = {
    short: false,
    light: false,
    dateFormat: 'm / d / Y',
    locale: 'en',
    datePickerType: 'single',
    minDate: moment().format('MM / DD / YYYY'),
  };

  constructor(props) {
    super(props);

    this.inputField = React.createRef();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      if (this.cal) {
        this.cal.setDate(nextProps.value);
      }
    }
  }

  handleChange = (pickerValue: PickerValue, stringValue: string) => {
    const {
      form: { setFieldValue },
      field: { name },
    } = this.props;

    const [month, day, year] = stringValue.split(' / ');
    const date = moment({
      year,
      month: parseInt(month, 10) - 1,
      day,
    })
      .startOf('day')
      .toDate();

    setFieldValue(name, date);
  };

  componentDidMount() {
    const {
      datePickerType,
      dateFormat,
      locale,
      appendTo,
      minDate,
      maxDate,
      value,
    } = this.props;

    const appendToNode =
      typeof appendTo === 'string'
        ? document.querySelector(appendTo)
        : appendTo;

    // inputField ref might not be set in enzyme tests
    if (this.inputField.current) {
      this.cal = new flatpickr(this.inputField.current, {
        defaultDate: value,
        appendTo: appendToNode,
        mode: datePickerType,
        allowInput: true,
        dateFormat: dateFormat,
        locale: l10n[locale],
        minDate: minDate,
        maxDate: maxDate,
        clickOpens: true,
        nextArrow: this.rightArrowHTML(),
        leftArrow: this.leftArrowHTML(),
        onChange: this.handleChange,
      });
      this.addKeyboardEvents(this.cal);
    }

    console.log(this.inputField);
  }

  componentWillUnmount() {
    if (this.cal) {
      this.cal.destroy();
    }
    console.log(this.inputField.current);
    if (this.inputField.current) {
      this.inputField.current.removeEventListener('change', this.onChange);
    }
    if (this.inputField.current) {
      this.toInputField.current.removeEventListener('change', this.onChange);
    }
  }

  onChange = e => {
    if (
      e.target.value === '' &&
      this.cal &&
      this.cal.selectedDates.length > 0
    ) {
      this.cal.clear();
    }
  };

  addKeyboardEvents = cal => {
    if (this.inputField.current) {
      this.inputField.current.addEventListener('keydown', e => {
        if (e.which === 40) {
          cal.calendarContainer.focus();
        }
      });
      this.inputField.current.addEventListener('change', this.onChange);
    }
    if (this.inputField.current) {
      this.toInputField.current.addEventListener('blur', () => {
        this.cal.close();
      });
      this.toInputField.current.addEventListener('change', this.onChange);
    }
  };

  rightArrowHTML() {
    return `
      <svg height="12" width="7" viewBox="0 0 7 12">
        <path d="M5.569 5.994L0 .726.687 0l6.336 5.994-6.335 6.002L0 11.27z"></path>
      </svg>`;
  }

  leftArrowHTML() {
    return `
      <svg width="7" height="12" viewBox="0 0 7 12" fill-rule="evenodd">
        <path d="M1.45 6.002L7 11.27l-.685.726L0 6.003 6.315 0 7 .726z"></path>
      </svg>`;
  }

  isLabelTextEmpty = children =>
    children.every(child => !child.props.labelText);

  render() {
    const {
      children,
      datePickerType,
      minDate, // eslint-disable-line
      maxDate, // eslint-disable-line
      dateFormat, // eslint-disable-line
      locale, // eslint-disable-line
      value, // eslint-disable-line
      iconDescription,
      ...other
    } = this.props;

    const { field, label, ...otherProps } = this.props;
    const displayValue = value ? moment(value).format('MM / DD / YYYY') : '';

    //
    return (
      <Fragment>
        <BaseInput
          autoComplete={'off'}
          value={displayValue}
          {...other}
          ref={this.inputField}
        />
        <GlobalStyles />
      </Fragment>
    );
  }
}
