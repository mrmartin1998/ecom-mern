const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Default 5 minutes

class CacheService {
  static async get(key) {
    return cache.get(key);
  }

  static async set(key, value, ttl = 300) {
    return cache.set(key, value, ttl);
  }

  static async clear(pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => 
      pattern.includes('*') ? 
        key.startsWith(pattern.replace('*', '')) : 
        key === pattern
    );
    cache.del(matchingKeys);
  }
}

module.exports = CacheService; 