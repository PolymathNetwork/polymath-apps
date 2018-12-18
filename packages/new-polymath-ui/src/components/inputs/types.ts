import * as React from 'react';

export type InputProps = {
  onChange: (e: any) => void;
  onBlur: (e: any) => void;
  value: any;
  name: string;
  error?: string;
};

export type FieldProps = {
  field: InputProps;
  form: {
    setFieldValue: (name: string, value: any) => void;
    errors: {
      [fieldName: string]: string[];
    };
    touched: {
      [fieldName: string]: boolean;
    };
    name: string;
  };
  label: React.ComponentType;
  className?: string;
  placeholder: string;
};
