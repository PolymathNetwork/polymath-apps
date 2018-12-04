export * from './entities';

export enum NetworkStatus {
  NotInitialized = 'NOT_INITIALIZED',
  Initialized = 'INITIALIZED',
  Connected = 'CONNECTED',
}

export enum NetworkClientSupport {
  None = 'NONE',
  Legacy = 'LEGACY',
  Modern = 'MODERN',
}
