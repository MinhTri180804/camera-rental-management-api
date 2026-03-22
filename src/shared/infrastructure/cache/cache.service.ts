import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ICacheService } from '@shared/domain/ports/cache.service';

/**
 * Cache Service Implementation - Infrastructure Layer
 *
 * This class provides a concrete implementation of the ICacheService port using
 * NestJS's CacheManager. It serves as an adapter in the Hexagonal Architecture
 * pattern, bridging the domain cache interface with the specific caching technology.
 *
 * ## Technology Stack
 * - **Cache Manager**: Uses @nestjs/cache-manager for underlying cache operations
 * - **Adapter Pattern**: Implements domain port while delegating to infrastructure
 * - **Dependency Injection**: Injects CACHE_MANAGER for testability and flexibility
 *
 * ## Implementation Details
 * - Wraps NestJS Cache operations to match domain interface expectations
 * - Handles null/undefined edge cases consistently
 * - Maintains async/await pattern for all operations
 * - Provides type-safe operations through generic constraints
 */
@Injectable()
export class CacheService implements ICacheService {
  /**
   * Creates an instance of CacheService
   *
   * @param _cache - Injected Cache instance from @nestjs/cache-manager
   */
  constructor(@Inject(CACHE_MANAGER) private readonly _cache: Cache) {}

  /**
   * Retrieves a value from the cache by key
   *
   * @template T - The expected type of the cached value
   * @param key - The cache key to retrieve
   * @returns Promise resolving to the cached value or null if not found
   *
   * @implementation
   * Delegates to CacheManager's get method and ensures consistent null handling
   * for cache misses or expired entries.
   *
   * @example
   * ```typescript
   * const user = await cacheService.get<User>('user:123');
   * // Returns: User object or null if not cached
   * ```
   */
  async get<T>(key: string) {
    const value = await this._cache.get<T>(key);
    if (!value) return null;
    return value;
  }

  /**
   * Stores a value in the cache with optional expiration
   *
   * @template T - The type of the value being cached
   * @param key - The cache key to store the value under
   * @param value - The value to cache
   * @param ttl - Optional time-to-live in seconds
   * @returns Promise that resolves when the value is successfully cached
   *
   * @implementation
   * Directly delegates to CacheManager's set method with the same parameters.
   * The underlying cache manager handles serialization and storage.
   *
   * @example
   * ```typescript
   * await cacheService.set('user:123', userData, 3600);
   * // Caches userData for 1 hour
   * ```
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this._cache.set(key, value, ttl ? ttl * 1000 : undefined);
    return;
  }

  /**
   * Removes a specific entry from the cache
   *
   * @param key - The cache key to delete
   * @returns Promise that resolves when the entry is successfully deleted
   *
   * @implementation
   * Uses CacheManager's del method to remove the specified key.
   * Operation is idempotent - deleting non-existent keys is safe.
   *
   * @example
   * ```typescript
   * await cacheService.delete('user:123');
   * // Removes user:123 from cache if it exists
   * ```
   */
  async delete(key: string): Promise<void> {
    await this._cache.del(key);
    return;
  }

  /**
   * Checks if a key exists in the cache
   *
   * @param key - The cache key to check
   * @returns Promise resolving to true if the key exists, false otherwise
   *
   * @implementation
   * Attempts to get the value and checks if it's not undefined.
   * This approach works with CacheManager's behavior where missing keys
   * return undefined rather than throwing errors.
   *
   * @example
   * ```typescript
   * const isCached = await cacheService.exists('user:123');
   * if (isCached) {
   *   // Key exists and hasn't expired
   * }
   * ```
   */
  async exists(key: string): Promise<boolean> {
    return await this._cache.get(key).then((value) => value !== undefined);
  }

  /**
   * Clears all entries from the cache
   *
   * @returns Promise that resolves when the cache is successfully cleared
   *
   * @implementation
   * Delegates to CacheManager's clear method to remove all cached entries.
   * This is a destructive operation that affects all cache data.
   *
   * @warning
   * This operation removes ALL cached data. Use with caution in production
   * environments as it may cause performance degradation until cache is rebuilt.
   *
   * @example
   * ```typescript
   * await cacheService.reset();
   * // Clears entire cache - use carefully!
   * ```
   */
  async reset(): Promise<void> {
    await this._cache.clear();
    return;
  }

  /**
   * Get remaining time-to-live (TTL) of a cache key in seconds.
   *
   * @param key - The cache key.
   * @returns The remaining TTL in seconds, or `null` if:
   * - the key does not exist
   * - the key has no expiration
   * - the underlying cache returns an invalid/undefined TTL
   */
  async ttl(key: string): Promise<number | null> {
    const ttl = await this._cache.ttl(key);
    if (ttl === undefined || ttl <= 0) return null;
    return ttl;
  }
}
