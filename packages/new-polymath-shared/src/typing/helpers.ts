export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type ExtractProps<
  TComponentOrTProps
> = TComponentOrTProps extends React.Component<infer TProps, any>
  ? TProps
  : TComponentOrTProps;
