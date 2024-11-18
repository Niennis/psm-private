const cache = new Map();

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    return cache.get(key);
  }

  async set(key, data, ctx) {
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
      tags: ctx ? ctx.tags : [],
    });
  }

  async revalidateTag(tag) {
    for (let [key, value] of cache) {
      if (value.tags.includes(tag)) {
        cache.delete(key);
      }
    }
  }
};
