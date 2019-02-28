import * as React from 'react';
export const SvgCalendar = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 16 18" {...props}>
    <g fill="currentColor" fillRule="evenodd">
      <path d="M0 2v16h16V2H0zm2 14V6h12v10H2z" />
      <path
        d="M2.06 4.26V.304h2V4.26h-2zm10 0V.304h2V4.26h-2z"
        fillRule="nonzero"
      />
      <path d="M10.04 13.434v-.856H8.744V7.85H7.648l-1.688.944.4.768 1.352-.76v3.776H6.264v.856z" />
    </g>
  </svg>
);
