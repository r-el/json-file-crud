/**
 * Queue management utilities for JsonFileCRUD
 * @version 1.0.0
 */

import { OPERATION_TYPES } from './constants.js';
import { readAllFromFile, writeItemsToFile } from './file-operations.js';

/**
 * Queue Manager class for handling sequential operations
 */
export class QueueManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.writeQueue = [];
    this.isWriting = false;
  }

  /**
   * Generic method to queue and execute operations
   * @param {string} type - Operation type
   * @param {Object} params - Operation parameters
   * @param {Function} callback - Callback function
   * @param {Function} operation - Operation function that processes items
   * @param {Object} crudInstance - Instance to use for processing queue
   */
  queueOperation(type, params, callback, operation, crudInstance) {
    // Add to queue if already processing
    if (this.isWriting) {
      this.writeQueue.push({
        type: type,
        params: params,
        callback: callback,
        operation: operation
      });
      return;
    }

    this.isWriting = true;

    readAllFromFile(this.filePath, (err, items) => {
      if (err) {
        this._finishOperation(callback, err, null, crudInstance);
        return;
      }

      try {
        const result = operation(items);
        
        // If operation returned early with callback, don't continue
        if (!result) {
          this._finishOperation(() => {}, null, null, crudInstance);
          return;
        }

        writeItemsToFile(this.filePath, result.items, (writeErr) => {
          this._finishOperation(callback, writeErr, result.result, crudInstance);
        });
      } catch (operationErr) {
        this._finishOperation(callback, operationErr, null, crudInstance);
      }
    });
  }

  /**
   * Finish operation and process queue
   * @param {Function} callback - Callback function
   * @param {Error} err - Error if any
   * @param {any} result - Result to pass to callback
   * @param {Object} crudInstance - Instance to use for processing queue
   * @private
   */
  _finishOperation(callback, err, result, crudInstance) {
    this.isWriting = false;
    
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
    
    if (crudInstance) {
      this.processQueue(crudInstance);
    }
  }

  /**
   * Process queued write operations
   * @param {Object} crudInstance - Instance of JsonFileCRUD to call methods on
   */
  processQueue(crudInstance) {
    if (this.writeQueue.length > 0 && !this.isWriting) {
      const queuedOperation = this.writeQueue.shift();

      if (queuedOperation.type === OPERATION_TYPES.CREATE) {
        crudInstance.create(queuedOperation.params.item, queuedOperation.callback);
      } else if (queuedOperation.type === OPERATION_TYPES.UPDATE) {
        crudInstance.update(queuedOperation.params.id, queuedOperation.params.data, queuedOperation.callback);
      } else if (queuedOperation.type === OPERATION_TYPES.DELETE) {
        crudInstance.delete(queuedOperation.params.id, queuedOperation.callback);
      } else if (queuedOperation.type === OPERATION_TYPES.WRITE_ALL) {
        crudInstance.writeAll(queuedOperation.params.items, queuedOperation.callback);
      } else if (queuedOperation.operation) {
        // Generic operation
        this.queueOperation(queuedOperation.type, queuedOperation.params, queuedOperation.callback, queuedOperation.operation);
      }
    }
  }
}
