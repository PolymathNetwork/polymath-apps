import * as React from 'react';

export interface InputProps {
  onChange: (e: any) => void;
  onBlur: (e: any) => void;
  value: any;
  name: string;
  error?: string;
  placeholder: string;
}

export interface FieldProps {
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
}
