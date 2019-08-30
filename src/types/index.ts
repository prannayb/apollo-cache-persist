import { ApolloCache } from 'apollo-cache';

export type LogLevel = 'log' | 'warn' | 'error';

export type LogLine = [LogLevel, any[]];

export type TriggerUninstallFunction = () => void;

export type TriggerFunction = (persist: () => void) => TriggerUninstallFunction;

export type PersistedData<T> = T | string | null;

export interface PersistentStorage<T> {
  getItem: (key: string) => Promise<T> | T | null;
  setItem: (key: string, data: T) => Promise<T> | Promise<void> | void | T;
  removeItem: (key: string) => Promise<T> | Promise<void> | void;
}

export interface ApolloPersistOptions<TSerialized> {
  cache: ApolloCache<TSerialized>;
  storage: PersistentStorage<PersistedData<TSerialized>>;
  trigger?: 'write' | 'background' | TriggerFunction | false;
  debounce?: number;
  key?: string;
  serialize?: boolean;
  maxSize?: number | false;
  /**
   * Use a function to filter the cache object to essentials before persisting.
   * This allows only the data we needed to be persisted and the rest can still
   * be in the immemory cache. The user is supposed to understand the
   * structure/implementation of the cache object and manipulate it themselves
   */
  filterCacheForPersistance?: (cacheObject: TSerialized) => TSerialized;

  debug?: boolean;
}
