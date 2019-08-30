import { ApolloCache } from 'apollo-cache';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Cache<T> {
  cache: ApolloCache<T>;
  serialize: boolean;
  filterCacheForPersistance: (cacheObject: T) => T;

  constructor(options: ApolloPersistOptions<T>) {
    const { cache, serialize = true, filterCacheForPersistance } = options;

    this.cache = cache;
    this.serialize = serialize;
    this.filterCacheForPersistance = filterCacheForPersistance;
  }

  extract(): PersistedData<T> {
    let data: PersistedData<T> = this.cache.extract() as T;

    //run a filter if present on the data to persist
    if (typeof this.filterCacheForPersistance === 'function') {
      data = this.filterCacheForPersistance(data);
    }

    if (this.serialize) {
      data = JSON.stringify(data) as string;
    }

    return data;
  }

  restore(data: PersistedData<T>): void {
    if (this.serialize && typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.cache.restore(data as T);
    }
  }
}
