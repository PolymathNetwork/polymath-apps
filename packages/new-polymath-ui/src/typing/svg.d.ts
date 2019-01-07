declare module '*.svg' {
  const url: string;
  export const ReactComponent: React.StatelessComponent<React.SVGAttributes<SVGElement>> {};
  export default url;
}
