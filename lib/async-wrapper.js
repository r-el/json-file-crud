/**
 * Async wrapper utilities for JsonFileCRUD
 * Provides Promise-based API alongside callback-based methods
 */

/**
 * Converts a callback-based method to Promise-based
 * @param {Function} method - The callback-based method to wrap
 * @param {Object} context - The context (this) to bind to the method
 * @returns {Function} Promise-based version of the method
 */
export function promisify(method, context) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Add callback that resolves or rejects the promise
      const callback = (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      };

      // Call the original method with callback
      method.call(context, ...args, callback);
    });
  };
}

/**
 * Creates async versions of all CRUD methods
 * @param {Object} crudInstance - Instance of JsonFileCRUD
 * @returns {Object} Object with async method variants
 */
export function createAsyncMethods(crudInstance) {
  return {
    // Create methods
    createAsync: promisify(crudInstance.create, crudInstance),

    // Read methods
    readAllAsync: promisify(crudInstance.readAll, crudInstance),
    findByIdAsync: promisify(crudInstance.findById, crudInstance),
    findByAsync: promisify(crudInstance.findBy, crudInstance),
    countAsync: promisify(crudInstance.count, crudInstance),

    // Update methods
    updateAsync: promisify(crudInstance.update, crudInstance),

    // Delete methods
    deleteAsync: promisify(crudInstance.delete, crudInstance),
    deleteAllAsync: promisify(crudInstance.deleteAll, crudInstance),

    // Utility methods
    writeAllAsync: promisify(crudInstance.writeAll, crudInstance),
  };
}
