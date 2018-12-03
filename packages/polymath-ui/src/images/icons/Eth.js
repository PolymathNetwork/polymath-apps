import React from 'react';

const SvgEth = props => (
  <svg width="1em" height="1em" {...props}>
    <defs>
      <circle id="eth_svg__a" cx={12.5} cy={12.5} r={12.5} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <mask id="eth_svg__b" fill="#fff">
        <use xlinkHref="#eth_svg__a" />
      </mask>
      <use fill="#EED3FE" xlinkHref="#eth_svg__a" />
      <g mask="url(#eth_svg__b)" fill="#724396" fillRule="nonzero">
        <path d="M12.808 5L8 13l4.808 2.857L17.615 13z" />
        <path d="M8 13.952l4.808 6.667 4.807-6.667-4.807 2.858z" />
      </g>
    </g>
  </svg>
);

export default SvgEth;
