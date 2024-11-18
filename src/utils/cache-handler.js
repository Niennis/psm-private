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
        tags: ctx && Array.isArray(ctx.tags) ? ctx.tags : [], // Asegurar que tags sea un arreglo
      });
      console.log(`Clave ${key} almacenada en caché.`);
    } catch (error) {
      console.error(`Error al guardar la clave ${key} en el caché:`, error);
      throw error;
    }
  }

  async revalidateTag(tag) {
    try {
      for (let [key, value] of cache) {
        if (Array.isArray(value.tags) && value.tags.includes(tag)) {
          console.log(`Revalidando clave ${key} con etiqueta ${tag}.`);
          cache.delete(key); // Elimina entradas asociadas a la etiqueta
        }
      }
    } catch (error) {
      console.error(`Error al revalidar la etiqueta ${tag} en el caché:`, error);
      throw error;
    }
  }
};