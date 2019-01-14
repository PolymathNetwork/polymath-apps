declare module 'web3-core-promievent' {
  import PromiEvent, { PromiEventType } from 'web3/promiEvent';

  class PromiEventClass {
    resolve: () => void;
    reject: (error: Error) => void;
    eventEmitter: PromiEvent<any> & {
      emit: (event: PromiEventType, ...args: any[]) => void;
    };
  }

  export = PromiEventClass;
}
