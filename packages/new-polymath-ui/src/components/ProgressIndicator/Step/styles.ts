import { styled } from '~/styles';
import { Paragraph } from '~/components/Paragraph';
import { IconOutlined } from '~/components/IconOutlined';
import { StepProps } from './';

type Props = Pick<StepProps, 'isComplete' | 'isCurrent' | 'isVertical'>;

export const iconsSize = '1.3em';

export const ProgressLine = styled.span`
  position: absolute;
  background-color: currentColor;
`;

export const Icon = styled(IconOutlined)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Label = styled(Paragraph)`
  line-height: ${iconsSize};
  color: currentColor;
`;

export const Inner = styled.div``;

export const Container = styled.li<Props>`
  position: relative;
  text-align: center;
  min-width: 7rem;
  transition: 250ms all cubic-bezier(0.5, 0, 0.1, 1);
  overflow: visible;
  color: ${({ theme, isComplete, isCurrent }) =>
    (!isCurrent && !isComplete && theme.colors.gray[2]) ||
    theme.colors.primary};
  flex: 1 1;

  ${({ isVertical }) =>
    isVertical
      ? `
      display: flex;
      align-items: flex-end;

      &:first-child {
        flex: none;
      }

      ${ProgressLine} {
        left: calc(${iconsSize} / 2);
        top: 0;
        width: 2px;
        height: calc(100% - ${iconsSize});
      }

      ${Inner} {
        display: flex;
        align-items: center;
      }
      `
      : `
      ${ProgressLine} {
        top: calc(${iconsSize} / 2);
        right: calc(50% + (${iconsSize} / 2));
        height: 2px;
        width: calc(100% - ${iconsSize});
      }

      ${Icon} {
        margin: auto;
      }
    `};

  &:first-child ${ProgressLine} {
    display: none;
  }
`;
