import React, { FC, useContext } from 'react';
import { styled } from '~/styles';
import { Notification } from '~/components/Notification';
import { Context } from '../Context';
import * as sc from './styles';

export interface Props {
  className?: string;
}

const CsvErrorsComponent: FC<Props> = ({ className, ...props }) => {
  const context = useContext(Context);

  if (!context) {
    return null;
  }

  const { isFullyInvalid, errorCount, data, csvConfig } = context;

  return (
    <sc.Wrapper className={className}>
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
      {isFullyInvalid && (
        <Notification
          status="alert"
          title="Your .csv structure is Invalid"
          description="Please make sure your .csv file follows the format of our sample file."
        />
      )}
      {!isFullyInvalid && !!errorCount && (
        <Notification
          status="alert"
          title={`${errorCount} Errors in Your .csv File`}
          description="Please note that the entries below contains error that prevent their content to be committed to the blockchain. Entries were automatically deselected so they are not submitted to the blockchain and may be edited separately."
        />
      )}
    </sc.Wrapper>
  );
};

export const CsvErrors = styled(CsvErrorsComponent)``;
