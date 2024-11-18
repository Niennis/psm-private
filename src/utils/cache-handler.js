const cache = new Map();

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    try {
      return cache.get(key);
    } catch (error) {
      console.error(`Error al obtener la clave ${key} del caché:`, error);
      throw error;
    }
  }

  async set(key, data, ctx) {
    try {
      cache.set(key, {
        value: data,
        lastModified: Date.now(),
        tags: ctx ? ctx.tags : [],
      });
    } catch (error) {
      console.error(`Error al guardar la clave ${key} en el caché:`, error);
      throw error;
    }
  }

  async revalidateTag(tag) {
    try {
      for (let [key, value] of cache) {
        if (value.tags.includes(tag)) {
          cache.delete(key);
        }
      }
    } catch (error) {
      console.error(`Error al revalidar la etiqueta ${tag} en el caché:`, error);
      throw error;
    }
  }
};