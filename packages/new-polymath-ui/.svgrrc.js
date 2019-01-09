module.exports = {
  template(
    { template },
    opts,
    { imports, componentName, props, jsx, exports }
  ) {
    const typeScriptTpl = template.smart(
      { plugins: ['typescript'] },
      { preserveComments: true }
    );
    return typeScriptTpl.ast`
    // This file has been generated automatically by SVGR CLI. Please see README.md for more details.
    import * as React from 'react';
    export const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => ${jsx};
  `;
  },
};
