import * as React from 'react';
export const SvgRestriction = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" fill="none" {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M32 5.333c14.667 0 26.667 12 26.667 26.667 0 14.667-12 26.667-26.667 26.667-14.667 0-26.667-12-26.667-26.667 0-14.667 12-26.667 26.667-26.667zM32 0C14.4 0 0 14.4 0 32s14.4 32 32 32 32-14.4 32-32S49.6 0 32 0z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.667 26.333c0-.736.597-1.333 1.333-1.333h4c.736 0 1.333.597 1.333 1.333v1.334H34v-1a.333.333 0 00-.333-.334h-3.334a.333.333 0 00-.333.334v1h-1.333v-1.334zm-4.667 12h16v-10H24v10z"
      fill="currentColor"
    />
    <path
      fill="currentColor"
      d="M16 16h6v6h-6zM16 42h6v6h-6zM42 16h6v6h-6zM42 42h6v6h-6zM18 22h2v18h-2zM44 24h2v18h-2zM24 18h18v2H24zM22 44h19v2H22z"
    />
  </svg>
);
