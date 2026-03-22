export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  reset(): Promise<void>;
  ttl(key: string): Promise<number | null>;
}

export const CACHE_SERVICE_TOKEN = Symbol('CACHE_SERVICE');
