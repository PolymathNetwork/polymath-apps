import React, { Component, Fragment } from 'react';
import moment from 'moment-timezone';
import flatpickr from 'flatpickr';
import l10n from 'flatpickr/dist/l10n/index';

import { BaseInput } from '../BaseInput';
import { InputProps } from '../types';
import { formikProxy } from '../formikProxy';
import * as sc from './styles';

import { SvgCalendar } from '~/images/icons/Calendar';
import { key as LocaleKey } from 'flatpickr/dist/types/locale';

export interface DatePickerInputProps {
  /**
   * The date format.
   */
  dateFormat: string;
  /**
   *  The language locale used to format the days of the week, months, and numbers.
   *  See https://flatpickr.js.org/localization/
   */
  locale: LocaleKey;
  /**
   * The value of the date value provided to flatpickr, could
   * be a date, a date number, a date string, an array of dates.
   */
  value: string | object | number | [string | number | object];
  /**
   * The DOM element or selector the Flatpicker should be inserted into. `<body>` by default.
   */
  appendTo: string | HTMLElement;
  /**
   * The `change` event handler.
   */
  onChange: (e: Event) => void;
  /**
   * The underlying input `change` event handler.
   */
  onInputChange: (e: Event) => void;
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
  datePickerType: 'single' | 'multiple' | 'range';
}

// Weekdays shorthand for english locale
l10n.en.weekdays.shorthand.forEach((_day, index) => {
  const currentDay = l10n.en.weekdays.shorthand;
  if (currentDay[index] === 'Thu' || currentDay[index] === 'Th') {
    currentDay[index] = 'Th';
  } else {
    currentDay[index] = currentDay[index].charAt(0);
  }
});

const now = moment().format('MM / DD / YYYY');

export class DatePickerInputComponent extends Component<
  DatePickerInputProps & InputProps
> {
  public static defaultProps: DatePickerInputProps = {
    dateFormat: 'm / d / Y',
    locale: 'en',
    datePickerType: 'single',
    minDate: now,
    maxDate: now,
    onInputChange: () => {},
    onChange: () => {},
    value: now,
    appendTo: 'body',
  };

  public inputField: React.RefObject<HTMLInputElement> = React.createRef();
  public cal: any;

  public componentDidUpdate(nextProps: DatePickerInputProps) {
    if (nextProps.value !== this.props.value) {
      if (this.cal) {
        this.cal.setDate(nextProps.value);
      }
    }
  }

  public componentDidMount() {
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
        ? (document.querySelector(appendTo) as HTMLElement) || undefined
        : appendTo;

    // inputField ref might not be set in enzyme tests
    if (this.inputField.current) {
      this.cal = flatpickr(this.inputField.current, {
        defaultDate: value,
        appendTo: appendToNode,
        mode: datePickerType,
        allowInput: true,
        dateFormat,
        locale: l10n[locale],
        minDate,
        maxDate,
        clickOpens: true,
        nextArrow: this.rightArrowHTML(),
        prevArrow: this.leftArrowHTML(),
        onChange: this.handleChange,
      });
      this.addKeyboardEvents(this.cal);
    }
  }

  public componentWillUnmount() {
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

  public handleChange = (_pickerValue: Date[], stringValue: string) => {
    const [month, day, year] = stringValue.split(' / ');
    const date = moment({
      year: parseInt(year, 10),
      month: parseInt(month, 10) - 1,
      day: parseInt(day, 10),
    })
      .startOf('day')
      .toDate();
    this.props.onChange(date);
  };

  public handleInputChange = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      if (
        target.value === '' &&
        this.cal &&
        this.cal.selectedDates.length > 0
      ) {
        this.cal.clear();
      }
    }
  };

  public addKeyboardEvents = (cal: any) => {
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

  public rightArrowHTML() {
    return `
      <svg height="12" width="7" viewBox="0 0 7 12">
        <path d="M5.569 5.994L0 .726.687 0l6.336 5.994-6.335 6.002L0 11.27z"></path>
      </svg>`;
  }

  public leftArrowHTML() {
    return `
      <svg width="7" height="12" viewBox="0 0 7 12" fill-rule="evenodd">
        <path d="M1.45 6.002L7 11.27l-.685.726L0 6.003 6.315 0 7 .726z"></path>
      </svg>`;
  }

  public render() {
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
      <sc.Wrapper>
        <sc.CalendarIcon Asset={SvgCalendar} />
        <BaseInput
          id={`${name}-input`}
          name={name}
          autoComplete={'off'}
          ref={this.inputField}
          onChange={onInputChange}
          {...otherProps}
        />
        <sc.GlobalStyles />
      </sc.Wrapper>
    );
  }
}

export const DatePickerInput = formikProxy(DatePickerInputComponent);
