import * as React from 'react';

export type InputProps = {
  onChange?: (value: any) => void;
  onBlur?: () => void;
  value?: any;
};

export type FieldProps = {
  field: InputProps & {
    name: string;
  };
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
