import { styled } from '~/styles';
import { FileUploaderPrimitive } from '~/components/FileUploader';
import { CsvErrors } from './CsvErrors';
import { CsvPreview } from './CsvPreview';

export const Wrapper = styled.div`
  ${FileUploaderPrimitive} + ${CsvErrors},
  ${CsvErrors} + ${CsvPreview} {
    margin-top: ${({ theme }) => theme.space.m};
  }
`;
