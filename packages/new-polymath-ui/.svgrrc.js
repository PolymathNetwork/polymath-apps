module.exports = {
  template(
    { template },
    opts,
    { imports, componentName, props, jsx, exports }
  ) {
    const typeScriptTpl = template.smart({ plugins: ['typescript'] });
    return typeScriptTpl.ast`
    import * as React from 'react';
    export const ${componentName} = (props: React.SVGProps<SVGSVGElement>) => ${jsx};
  `;
  },
};
