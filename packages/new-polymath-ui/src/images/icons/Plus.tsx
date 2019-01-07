import * as React from 'react';
export const SvgPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" {...props}>
    <path d="M7 0H5v5H0v2h5v5h2V7h5V5H7z" fillRule="evenodd" />
  </svg>
);
