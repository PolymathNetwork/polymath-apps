import React from 'react';

const SvgNetwork = props => (
  <svg
    viewBox="0 0 24 24"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <path id="b" d="M0 0h1440v48H0z" />
      <filter
        x="0%"
        y="-1%"
        width="100.1%"
        height="104.2%"
        filterUnits="objectBoundingBox"
        id="a"
      >
        <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
        <feColorMatrix
          values="0 0 0 0 0.874509811 0 0 0 0 0.890196085 0 0 0 0 0.90196079 0 0 0 1 0"
          in="shadowOffsetOuter1"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-751 -12)">
        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
        <use fill="#FFF" xlinkHref="#b" />
      </g>
      <g>
        <path d="M0 0h24v24H0z" />
        <circle fill="#00AA5E" cx={12} cy={12} r={6} />
      </g>
    </g>
  </svg>
);

export default SvgNetwork;
