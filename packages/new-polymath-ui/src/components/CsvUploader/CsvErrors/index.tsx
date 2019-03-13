import React, { FC, useContext } from 'react';
import { csvParser } from '@polymathnetwork/new-shared';
import { styled } from '~/styles';
import { Notification } from '~/components/Notification';
import { getContext } from '../Context';
import * as sc from './styles';

export interface Props {
  className?: string;
}

const CsvErrorsComponent: FC<Props> = ({ className }) => {
  const context = useContext(getContext());

  if (!context) {
    return null;
  }

  const { isFullyInvalid, errorCount, data, csvConfig } = context;
  return (
    <sc.Wrapper className={className}>
      {isFullyInvalid && (
        <Notification
          status="alert"
          title="Your .csv structure is Invalid"
          description="Please make sure your .csv file follows the format of our sample file."
        />
      )}
      {data.errors.includes(csvParser.ErrorCodes.missingRequiredColumns) && (
        <Notification
          status="alert"
          title={`Missing Required Columns`}
          description="Your .csv file is missing some columns that are required."
        />
      )}
      {data.errors.includes(csvParser.ErrorCodes.customValidationFailed) && (
        <Notification
          status="alert"
          title={
            csvConfig.customValidationErrorMessage
              ? csvConfig.customValidationErrorMessage.header
              : 'Invalid File'
          }
          description={
            csvConfig.customValidationErrorMessage
              ? csvConfig.customValidationErrorMessage.body
              : 'File validation failed'
          }
        />
      )}
      {!isFullyInvalid && !!errorCount && (
        <Notification
          status="alert"
          title={`${errorCount} Errors in Your .csv File`}
          description="Please note that the entries below contains error that prevent their content to be committed to the blockchain. Entries were automatically deselected so they are not submitted to the blockchain and may be edited separately."
        />
      )}
      {!!csvConfig.maxRows && data.totalRows > csvConfig.maxRows && (
        <Notification
          status="warning"
          title={`More Than ${csvConfig.maxRows} Records Found`}
          description={`Only ${
            csvConfig.maxRows
          } records can be uploaded at a time. Any records above ${
            csvConfig.maxRows
          } limit will not be added.`}
        />
      )}
      {data.errors.includes(csvParser.ErrorCodes.extraColumns) && (
        <Notification
          status="warning"
          title="Your .csv has extra columns"
          description="Only the columns listed below will be used. Make sure your .csv format is correct."
        />
      )}
    </sc.Wrapper>
  );
};

export const CsvErrors = styled(CsvErrorsComponent)``;
