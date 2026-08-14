export interface CacheStore {
  get(key: string): Promise<string | null>;

  set(key: string, value: string, ttlSeconds?: number): Promise<'OK' | null>;

  delete(key: string): Promise<number>;

  exists(key: string): Promise<boolean>;

  expire(key: string, ttlSeconds: number): Promise<boolean>;

  ttl(key: string): Promise<number>;
}
