// @flow
import type { Node } from 'react';

export type InputProps = {
  field: {
    onChange: (value: any) => void,
    onBlur: () => void,
    name: string,
    value: any,
  },
  form: {
    setFieldValue: (name: string, value: any) => void,
    errors: {
      [fieldName: string]: string[],
    },
    touched: {
      [fieldName: string]: boolean,
    },
    name: string,
  },
  label: Node,
  className?: string,
  placeholder: string,
};
