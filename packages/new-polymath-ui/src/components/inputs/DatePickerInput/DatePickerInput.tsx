import React, { Component, Fragment } from 'react';
import moment from 'moment-timezone';
import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n/index';

import { Icon } from '~/components/Icon';
import { BaseInput } from '../BaseInput';
import { InputProps } from '../types';
import { formikProxy } from '../formikProxy';
import { GlobalStyles } from './styles';

import { SvgCalendar } from '../../../images/icons/Calendar.svg';

type PickerValue = [Date, string];

export interface DatePickerInputProps {
  /**
   * The date format.
   */
  dateFormat: string;
  /**
   *  The language locale used to format the days of the week, months, and numbers.
   *  See https://flatpickr.js.org/localization/
   */
  locale: string;
  /**
   * The value of the date value provided to flatpickr, could
   * be a date, a date number, a date string, an array of dates.
   */
  value: string | object | number | [string | number | object];
  /**
   * The DOM element or selector the Flatpicker should be inserted into. `<body>` by default.
   */
  appendTo: string | object;
  /**
   * The `change` event handler.
   */
  onChange: Function;
  /**
   * The underlying input `change` event handler.
   */
  onInputChange: Function;
  /**
   * The minimum date that a user can start picking from.
   */
  minDate: string;
  /**
   * The maximum date that a user can pick to.
   */
  maxDate: string;
  /**
   * See https://flatpickr.js.org/options/
   */
  datePickerType: string;
}

// Weekdays shorthand for english locale
l10n.en.weekdays.shorthand.forEach((day, index) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

export class DatePickerInputComponent extends Component<
  DatePickerInputProps & InputProps
> {
  inputField: React.RefObject<HTMLInputElement> = React.createRef();
  cal: any;

  static defaultProps = {
    dateFormat: 'm / d / Y',
    locale: 'en',
    datePickerType: 'single',
    minDate: moment().format('MM / DD / YYYY'),
    onInputChange: () => {},
  };

  componentDidUpdate(nextProps: DatePickerInputProps) {
    if (nextProps.value !== this.props.value) {
      if (this.cal) {
        this.cal.setDate(nextProps.value);
      }
    }
  }

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
  }

  componentWillUnmount() {
    if (this.cal) {
      this.cal.destroy();
    }

    if (this.inputField.current) {
      this.inputField.current.removeEventListener(
        'change',
        this.handleInputChange
      );
    }
  }

  handleChange = (pickerValue: PickerValue, stringValue: string) => {
    const [month, day, year] = stringValue.split(' / ');
    const date = moment({
      year,
      month: parseInt(month, 10) - 1,
      day,
    })
      .startOf('day')
      .toDate();
    // console.log(stringValue);
    this.props.onChange(date);
  };

  handleInputChange = (e: Event) => {
    if (
      e.target.value === '' &&
      this.cal &&
      this.cal.selectedDates.length > 0
    ) {
      this.cal.clear();
    }
  };

  addKeyboardEvents = (cal: any) => {
    if (this.inputField.current) {
      this.inputField.current.addEventListener('keydown', e => {
        if (e.which === 40) {
          cal.calendarContainer.focus();
        }
      });
      this.inputField.current.addEventListener(
        'change',
        this.handleInputChange
      );
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

  render() {
    const {
      name,
      minDate,
      maxDate,
      dateFormat,
      locale,
      value,
      onChange,
      onInputChange,
      ...otherProps
    } = this.props;

    return (
      <Fragment>
        <Icon Asset={SvgCalendar} />
        <BaseInput
          id={`${name}-input`}
          name={name}
          autoComplete={'off'}
          ref={this.inputField}
          onChange={onInputChange}
          {...otherProps}
        />
        <GlobalStyles />
      </Fragment>
    );
  }
}

export const DatePickerInput = formikProxy(DatePickerInputComponent);
