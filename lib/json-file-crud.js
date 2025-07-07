/**
 * JsonFileCRUD - A generic CRUD library for managing JSON objects in text files
 * 
 * Features:
 * - Sequential operation processing with write queue
 * - Auto-ID assignment for new items
 * - Duplicate ID prevention
 * - Configurable ID field
 * - Comprehensive error handling
 * 
 * @version 1.0.0
 * @author REL
 */

import path from "path";
import { OPERATION_TYPES, ERROR_MESSAGES, DEFAULT_CONFIG } from './constants.js';
import { validateItem, createNotFoundError, createDuplicateIdError, createCannotChangeIdError } from './validators.js';
import { readAllFromFile, writeItemsToFile } from './file-operations.js';
import { QueueManager } from './queue-manager.js';

class JsonFileCRUD {
  /**
   * Create a new JsonFileCRUD instance
   * @param {string} filePath - Path to the JSON file
   * @param {Object} options - Configuration options
   * @param {string} options.idField - Name of the ID field (default: 'id')
   */
  constructor(filePath, options = {}) {
    if (!filePath) {
      throw new Error(ERROR_MESSAGES.FILE_PATH_REQUIRED);
    }
    this.filePath = path.resolve(filePath);
    this.idField = options.idField || DEFAULT_CONFIG.ID_FIELD;
    this.queueManager = new QueueManager(this.filePath);
  }

  //#region CREATE

  /**
   * Create a new item in the JSON file
   * @param {Object} item - Item to create
   * @param {Function} callback - Called with (error, createdItem)
   */
  create(item, callback) {
    // Basic validation
    const validationError = validateItem(item);
    if (validationError) {
      return callback(validationError);
    }

    this.queueManager.queueOperation(OPERATION_TYPES.CREATE, { item }, callback, (items) => {
      // Auto-assign ID if not provided
      if (!item[this.idField]) {
        item[this.idField] = this._generateNextId(items);
      }

      // Check for duplicate ID
      const existingItem = items.find(existingItem => 
        existingItem[this.idField] === item[this.idField]
      );
      if (existingItem) {
        return callback(createDuplicateIdError(this.idField, item[this.idField]));
      }

      // Add new item to array
      items.push(item);

      return { items, result: item };
    }, this);
  }

  /**
   * Generate next available ID
   * @param {Object[]} items - Array of existing items
   * @returns {number} Next available ID
   * @private
   */
  _generateNextId(items) {
    if (items.length === 0) return 1;
    
    // Find the highest numeric ID
    const numericIds = items
      .map(item => item[this.idField])
      .filter(id => typeof id === 'number' && !isNaN(id))
      .sort((a, b) => b - a);
    
    return numericIds.length > 0 ? numericIds[0] + 1 : 1;
  }

  //#endregion CREATE

  //#region READ

  /**
   * Reads all items from the file
   * @param {Function} callback - Called with (error, items)
   */
  readAll(callback) {
    readAllFromFile(this.filePath, callback);
  }

  /**
   * Finds an item by ID
   * @param {any} id - The ID of the item to find
   * @param {Function} callback - Called with (error, item)
   */
  findById(id, callback) {
    this.readAll((err, items) => {
      if (err) return callback(err);

      const item = items.find((item) => item[this.idField] === id);
      if (!item) {
        return callback(createNotFoundError(this.idField, id));
      }

      callback(null, item);
    });
  }

  /**
   * Finds items by filter function
   * @param {Function} filterFn - Function that returns true for matching items
   * @param {Function} callback - Called with (error, items)
   */
  findBy(filterFn, callback) {
    this.readAll((err, items) => {
      if (err) return callback(err);

      const matchingItems = items.filter(filterFn);
      callback(null, matchingItems);
    });
  }

  /**
   * Counts total items
   * @param {Function} callback - Called with (error, count)
   */
  count(callback) {
    this.readAll((err, items) => {
      if (err) return callback(err);
      callback(null, items.length);
    });
  }

  //#endregion READ

  //#region UPDATE

  /**
   * Update an existing item in the JSON file
   * @param {any} id - ID of the item to update
   * @param {Object} data - Data to update
   * @param {Function} callback - Called with (error, updatedItem)
   */
  update(id, data, callback) {
    // Basic validation
    const validationError = validateItem(data);
    if (validationError) {
      return callback(validationError);
    }

    // Prevent changing ID field
    if (data[this.idField] && data[this.idField] !== id) {
      return callback(createCannotChangeIdError(this.idField));
    }

    this.queueManager.queueOperation(OPERATION_TYPES.UPDATE, { id, data }, callback, (items) => {
      // Find item to update
      const itemIndex = this._findItemIndex(items, id);
      if (itemIndex === -1) {
        return callback(createNotFoundError(this.idField, id));
      }

      // Update item (merge data with existing item)
      const updatedItem = { ...items[itemIndex], ...data };
      items[itemIndex] = updatedItem;

      return { items, result: updatedItem };
    }, this);
  }

  //#endregion UPDATE

  //#region DELETE

  /**
   * Delete an item from the JSON file
   * @param {any} id - ID of the item to delete
   * @param {Function} callback - Called with (error, deletedItem)
   */
  delete(id, callback) {
    this.queueManager.queueOperation(OPERATION_TYPES.DELETE, { id }, callback, (items) => {
      // Find item to delete
      const itemIndex = this._findItemIndex(items, id);
      if (itemIndex === -1) {
        return callback(createNotFoundError(this.idField, id));
      }

      // Store deleted item for return
      const deletedItem = items[itemIndex];
      
      // Remove item from array
      items.splice(itemIndex, 1);

      return { items, result: deletedItem };
    }, this);
  }

  //#endregion DELETE

  //#region UTILITY METHODS

  /**
   * Find item index by ID
   * @param {Object[]} items - Array of items
   * @param {any} id - ID to search for
   * @returns {number} Index of item or -1 if not found
   * @private
   */
  _findItemIndex(items, id) {
    return items.findIndex((item) => item[this.idField] === id);
  }

  /**
   * Writes items array to file, replacing all content
   * @param {Object[]} items - Array of items to save
   * @param {Function} callback - Called with (error)
   */
  writeAll(items, callback) {
    // Add to queue if already writing
    if (this.queueManager.isWriting) {
      this.queueManager.writeQueue.push({ 
        type: OPERATION_TYPES.WRITE_ALL,
        params: { items }, 
        callback: callback 
      });
      return;
    }

    this.queueManager.isWriting = true;
    writeItemsToFile(this.filePath, items, (writeErr) => {
      this.queueManager._finishOperation(callback, writeErr, null, this);
    });
  }

  /**
   * Process queued write operations
   */
  processWriteQueue() {
    this.queueManager.processQueue(this);
  }

  //#endregion UTILITY METHODS
}

export default JsonFileCRUD;
