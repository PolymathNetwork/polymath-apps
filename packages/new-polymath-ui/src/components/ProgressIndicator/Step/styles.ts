import { styled } from '~/styles';
import { Paragraph } from '~/components/Paragraph';
import { IconOutlined } from '~/components/IconOutlined';
import { StepProps } from './';

type Props = Pick<StepProps, 'isComplete' | 'isCurrent' | 'isVertical'>;

export const iconsSize = '1.6em';

export const ProgressLine = styled.span`
  position: absolute;
  background-color: currentColor;
`;

export const Icon = styled(IconOutlined)`
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  flex-shrink: 0;
`;

export const Label = styled(Paragraph)`
  line-height: ${iconsSize};
  color: currentColor;
`;

export const Inner = styled.div``;

export const Container = styled.li<Props>`
  position: relative;
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
      align-items: flex-start;

      &:first-child {
        flex: none;
      }

      ${ProgressLine} {
        left: calc(${iconsSize} / 2);
        top: ${iconsSize};
        bottom: 0;
        width: 2px;
      }

      ${Inner} {
        display: flex;
        align-items: center;
      }
      `
      : `
      text-align: center;

      ${ProgressLine} {
        top: calc(${iconsSize} / 2);
        left: calc(50% + (${iconsSize} / 2));
        height: 2px;
        width: calc(100% - ${iconsSize});
      }

      ${Icon} {
        margin: auto;
      }
    `};

  &:last-child ${ProgressLine} {
    display: none;
  }
`;
