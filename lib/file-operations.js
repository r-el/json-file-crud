/**
 * File operations utilities for JsonFileCRUD
 * @version 1.1.0
 */

import fs from 'fs';
import path from 'path';
import { ERROR_MESSAGES } from './constants.js';

/**
 * Read all items from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Function} callback - Called with (error, items)
 */
export function readAllFromFile(filePath, callback) {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err && err.code !== "ENOENT") {
      // File system error other than "file not found"
      callback(err);
    } else {
      // File doesn't exist or read successfully - parse as JSON array
      try {
        const items = content ? JSON.parse(content) : [];
        if (!Array.isArray(items)) {
          throw new Error(ERROR_MESSAGES.INVALID_JSON_ARRAY);
        }
        callback(null, items);
      } catch (error) {
        callback(error);
      }
    }
  });
}

/**
 * Write items array to file
 * @param {string} filePath - Path to the JSON file
 * @param {Object[]} items - Array of items to write
 * @param {Function} callback - Called with (error)
 */
export function writeItemsToFile(filePath, items, callback) {
  // Ensure directory exists
  const dir = path.dirname(filePath);
  fs.mkdir(dir, { recursive: true }, (mkdirErr) => {
    if (mkdirErr) {
      return callback(mkdirErr);
    }
    
    const content = JSON.stringify(items, null, 2);
    fs.writeFile(filePath, content, callback);
  });
}
