// Enhanced Cache Service for Clinical Hub - Data Persistence & Performance
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  version: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags: string[];
}

interface CacheConfig {
  defaultTTL: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  persistOffline: boolean;
  compressionEnabled: boolean;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalRequests: number;
  size: number;
  hitRate: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalRequests: 0,
    size: 0,
    hitRate: 0
  };
  private cleanupInterval: NodeJS.Timeout | null = null;
  private persistenceKey = 'reprotech_clinical_cache';

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes default
      maxSize: 1000,
      persistOffline: true,
      compressionEnabled: false,
      ...config
    };

    this.startCleanupTimer();
    this.loadFromPersistence();
  }

  // Core cache operations
  public set<T>(
    key: string, 
    data: T, 
    options: {
      ttl?: number;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      tags?: string[];
      version?: string;
    } = {}
  ): void {
    const now = Date.now();
    const ttl = options.ttl || this.config.defaultTTL;
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + ttl,
      version: options.version || '1.0',
      priority: options.priority || 'MEDIUM',
      tags: options.tags || []
    };

    // If cache is full, make room based on priority and age
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastImportant();
    }

    this.cache.set(key, entry);
    this.updateStats();
    
    // Persist critical data immediately
    if (entry.priority === 'CRITICAL' && this.config.persistOffline) {
      this.persistToStorage();
    }
  }

  public get<T>(key: string): T | null {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return entry.data as T;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStats();
    }
    return deleted;
  }

  public clear(): void {
    this.cache.clear();
    this.updateStats();
    this.clearPersistence();
  }

  // Advanced operations
  public getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    options: {
      ttl?: number;
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      tags?: string[];
      version?: string;
    } = {}
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return Promise.resolve(cached);
    }

    return fetchFunction().then(data => {
      this.set(key, data, options);
      return data;
    });
  }

  public invalidateByTag(tag: string): number {
    let count = 0;
    
    this.cache.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    });
    
    this.updateStats();
    return count;
  }

  public invalidateByVersion(version: string): number {
    let count = 0;
    
    this.cache.forEach((entry, key) => {
      if (entry.version === version) {
        this.cache.delete(key);
        count++;
      }
    });
    
    this.updateStats();
    return count;
  }

  public touch(key: string, additionalTTL?: number): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    const extendBy = additionalTTL || this.config.defaultTTL;
    entry.expiresAt = now + extendBy;
    
    return true;
  }

  // Clinical Hub specific cache operations
  public cacheAnimalData(animalId: string, data: any): void {
    this.set(`animal:${animalId}`, data, {
      ttl: 10 * 60 * 1000, // 10 minutes for animal data
      priority: 'HIGH',
      tags: ['animals', 'clinical'],
      version: '1.0'
    });
  }

  public cacheWorkflowData(workflowId: string, data: any): void {
    this.set(`workflow:${workflowId}`, data, {
      ttl: 30 * 60 * 1000, // 30 minutes for workflow data
      priority: 'CRITICAL',
      tags: ['workflows', 'clinical'],
      version: '1.0'
    });
  }

  public cacheUltrasoundResults(animalId: string, examId: string, data: any): void {
    this.set(`ultrasound:${animalId}:${examId}`, data, {
      ttl: 60 * 60 * 1000, // 1 hour for ultrasound results
      priority: 'HIGH',
      tags: ['ultrasound', 'clinical', `animal:${animalId}`],
      version: '1.0'
    });
  }

  public cacheReports(reportId: string, data: any): void {
    this.set(`report:${reportId}`, data, {
      ttl: 24 * 60 * 60 * 1000, // 24 hours for reports
      priority: 'MEDIUM',
      tags: ['reports'],
      version: '1.0'
    });
  }

  // Performance and monitoring
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public getMemoryUsage(): { used: number; available: number; percentage: number } {
    const used = this.cache.size;
    const available = this.config.maxSize - used;
    const percentage = (used / this.config.maxSize) * 100;
    
    return { used, available, percentage };
  }

  public export(): { [key: string]: any } {
    const exported: { [key: string]: any } = {};
    
    this.cache.forEach((entry, key) => {
      if (Date.now() <= entry.expiresAt) {
        exported[key] = {
          data: entry.data,
          metadata: {
            timestamp: entry.timestamp,
            expiresAt: entry.expiresAt,
            version: entry.version,
            priority: entry.priority,
            tags: entry.tags
          }
        };
      }
    });
    
    return exported;
  }

  public import(data: { [key: string]: any }): number {
    let imported = 0;
    
    Object.entries(data).forEach(([key, value]) => {
      if (value.data && value.metadata) {
        const entry: CacheEntry<any> = {
          data: value.data,
          timestamp: value.metadata.timestamp,
          expiresAt: value.metadata.expiresAt,
          version: value.metadata.version,
          priority: value.metadata.priority,
          tags: value.metadata.tags
        };
        
        // Only import non-expired entries
        if (Date.now() <= entry.expiresAt) {
          this.cache.set(key, entry);
          imported++;
        }
      }
    });
    
    this.updateStats();
    return imported;
  }

  // Private methods
  private evictLeastImportant(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by priority (LOW first) and then by age (oldest first)
    entries.sort(([, a], [, b]) => {
      const priorityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp; // Older entries first
    });

    // Remove the least important entry
    if (entries.length > 0) {
      this.cache.delete(entries[0][0]);
    }
  }

  private updateStats(): void {
    this.stats.size = this.cache.size;
  }

  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? (this.stats.hits / this.stats.totalRequests) * 100 
      : 0;
  }

  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleanedCount++;
      }
    });
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleanedCount} expired entries`);
      this.updateStats();
    }
  }

  private persistToStorage(): void {
    if (!this.config.persistOffline) return;
    
    try {
      const criticalData = this.export();
      localStorage.setItem(this.persistenceKey, JSON.stringify({
        data: criticalData,
        timestamp: Date.now(),
        version: '1.0'
      }));
    } catch (error) {
      console.warn('Failed to persist cache to storage:', error);
    }
  }

  private loadFromPersistence(): void {
    if (!this.config.persistOffline) return;
    
    try {
      const stored = localStorage.getItem(this.persistenceKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const imported = this.import(parsed.data);
        console.log(`📦 Loaded ${imported} entries from cache persistence`);
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private clearPersistence(): void {
    try {
      localStorage.removeItem(this.persistenceKey);
    } catch (error) {
      console.warn('Failed to clear cache persistence:', error);
    }
  }

  // Cleanup resources
  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    if (this.config.persistOffline) {
      this.persistToStorage();
    }
    
    this.cache.clear();
  }
}

// Create singleton instances for different use cases
export const mainCache = new CacheService({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 1000,
  persistOffline: true
});

export const reportCache = new CacheService({
  defaultTTL: 24 * 60 * 60 * 1000, // 24 hours
  maxSize: 200,
  persistOffline: true
});

export const imageCache = new CacheService({
  defaultTTL: 60 * 60 * 1000, // 1 hour
  maxSize: 100,
  persistOffline: false // Images can be large
});

export default CacheService; 