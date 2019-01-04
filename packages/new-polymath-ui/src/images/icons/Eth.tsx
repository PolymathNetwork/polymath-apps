import * as React from 'react';
export const SvgEth = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" {...props}>
    <circle fill="#EED3FE" cx={12.5} cy={12.5} r={12.5} />
    <g fill="#724396">
      <path d="M12.808 5L8 13l4.808 2.857L17.615 13z" />
      <path d="M8 13.952l4.808 6.667 4.807-6.667-4.807 2.858z" />
    </g>
  </svg>
);
