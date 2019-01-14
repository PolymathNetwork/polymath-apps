// declare const PromiEvent: PromiEventType<any>;

declare module 'web3-core-promievent' {
  import PromiEvent from 'web3/promiEvent';
  interface PromiEventClass<T> {
    new (): {
      eventEmitter: PromiEvent<T>;
      resolve: () => void;
    };
  }
  const PromiEventClass: PromiEventClass<any>;
  export = PromiEventClass;
}
