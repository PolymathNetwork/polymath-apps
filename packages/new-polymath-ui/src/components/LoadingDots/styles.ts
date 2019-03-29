import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  80% {
    transform: scale(0);
  }
  100% {
    transform: scale(0);
  }
`;

export const Wrapper = styled.div`
  width: 70px;
  text-align: center;

  span:before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.secondary};
    border-radius: 100%;
    display: inline-block;
    animation: ${bounce} 1.4s infinite ease-in-out both;
  }

  ,
  span:nth-child(1) {
    &:before {
      animation-delay: -0.32s;
    }
  }

  span:nth-child(2) {
    &:before {
      animation-delay: -0.16s;
    }
  }
`;
