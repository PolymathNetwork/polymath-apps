import React from 'react';

export const Context = React.createContext<{ name: string }>({
  name: 'unnamedField',
});
