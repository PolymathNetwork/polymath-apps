import React, { FC } from 'react';
import Dropzone, { DropzoneProps } from 'react-dropzone';
import { typeHelpers } from '@polymathnetwork/new-shared';
import { Text } from '~/components/Text';
import { SvgClose } from '~/images/icons';
import {
  FormikProxy,
  FormikExternalProps,
} from '~/components/inputs/FormikProxy';
import { styled } from '~/styles';
import * as sc from './styles';

type Value = File | File[] | null;

interface Props extends typeHelpers.Omit<DropzoneProps, 'children'> {
  onChange: (value: Value) => void;
  multiple?: boolean;
  uploadTo?: string;
  onTouch?: () => void;
  onError?: () => void;
  className?: string;
  style?: any;
}

interface State {
  files: File[];
  progress: number;
  isFocused: boolean;
}

class FileUploaderComponent extends React.Component<Props, State> {
  public static defaultProps = {
    multiple: false, // only single file supported in this implementation
    onTouch: () => {},
    onError: () => {},
  };

  public state: State = {
    files: [],
    progress: -1,
    isFocused: false,
  };

  public inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  public onDrop = (acceptedFiles: File[]) => {
    this.setState({
      files: acceptedFiles,
    });

    if (!acceptedFiles) {
      return;
    }

    if (this.props.onTouch) {
      this.props.onTouch();
    }

    if (!this.props.uploadTo) {
      this.setState({ progress: 100 });

      if (this.props.onChange) {
        this.props.onChange(
          this.props.multiple ? acceptedFiles : acceptedFiles[0]
        );
      }

      return;
    }
  };

  public handleRemoveFile = () => {
    this.reset();
  };

  public handleCancelUpload = () => {
    // this.axiosRequest.cancel();
    this.reset();
  };

  public handleInputFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  public handleInputBlur = () => {
    this.setState({
      isFocused: false,
    });
  };

  public reset() {
    this.setState({
      files: [],
      progress: -1,
    });
    this.props.onChange([]);
  }

  public renderInput() {
    const { className, style, ...otherProps } = this.props;

    // If in progress
    if (this.state.progress > -1 && this.state.progress < 100) {
      return (
        <button
          type="button"
          onClick={this.handleCancelUpload}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
        >
          <Text size="xs" color="white">
            Uploading...
          </Text>
          <div style={{ width: `${this.state.progress}%` }} />
          <sc.FileRemoveButton
            onClick={this.handleRemoveFile}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            Asset={SvgClose}
            scale={0.75}
            width={18}
            height={18}
          />
        </button>
      );
    }

    // If uploaded
    if (this.state.progress === 100) {
      if (this.props.multiple) {
      } else {
        return (
          <sc.File minWidth={270} maxWidth="100%">
            <sc.FileName fontSize={1} mr="auto">
              {this.state.files[0].name}
            </sc.FileName>
            <sc.FileRemoveButton
              onClick={this.handleRemoveFile}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              Asset={SvgClose}
              scale={0.75}
              width={18}
              height={18}
            />
          </sc.File>
        );
      }
    }

    // Default state
    return (
      <Dropzone
        onDrop={this.onDrop}
        onFocus={this.handleInputFocus}
        onBlur={this.handleInputBlur}
        {...otherProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <sc.Dropzone {...getRootProps()} isDragActive={isDragActive}>
            <input {...getInputProps()} />
            <Text fontSize={6} fontWeight="light" color="gray.2">
              Drop file or click here
            </Text>
          </sc.Dropzone>
        )}
      </Dropzone>
    );
  }

  public render() {
    const {
      className,
      style,
    } = this.props;

    return <div className={className} style={style}>{this.renderInput()}</div>;
  }
}

export const FileUploaderPrimitive = styled(FileUploaderComponent)``;

const FileUploaderWithFormik: FC<FormikExternalProps> = ({
  field,
  form,
  ...rest
}) => (
  <FormikProxy<Value>
    field={field}
    form={form}
    render={formikProps => <FileUploaderPrimitive {...rest} {...formikProps} />}
  />
);

export const FileUploader = styled(FileUploaderWithFormik)``;
