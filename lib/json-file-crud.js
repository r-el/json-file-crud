/**
 * JsonFileCRUD - A generic CRUD library for managing JSON objects in text files
 * @version 1.0.0
 * @author REL
 */

import fs from "fs";
import path from "path";

class JsonFileCRUD {
  constructor(filePath, options = {}) {
    if (!filePath) {
      throw new Error("File path is required");
    }
    this.filePath = path.resolve(filePath);
    this.idField = options.idField || "id";
    this.writeQueue = [];
    this.isWriting = false;
  }

  //#region CREATE

  create(data, callback) {
    // TODO: implement create
  }

  //#endregion CREATE

  //#region READ

  /**
   * Reads all items from the file
   * @param {Function} callback - Called with (error, items)
   */
  readAll(callback) {
    fs.readFile(this.filePath, "utf-8", (err, content) => {
      if (err && err.code !== "ENOENT") {
        // File system error other than "file not found"
        callback(err);
      } else {
        // File doesn't exist or read successfully - parse as JSON array
        try {
          const items = content ? JSON.parse(content) : [];
          if (!Array.isArray(items)) {
            throw new Error("File content is not a JSON array");
          }
          callback(null, items);
        } catch (error) {
          callback(error);
        }
      }
    });
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
        return callback(new Error(`Item with ${this.idField} ${id} not found`));
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

  update(id, data, callback) {
    // TODO: implement update
  }

  //#endregion UPDATE

  //#region DELETE

  delete(id, callback) {
    // TODO: implement delete
  }

  //#endregion DELETE

  /**
   * Writes items array to file, replacing all content
   * @param {Object[]} items - Array of items to save
   * @param {Function} callback - Called with (error)
   */
  writeAll(items, callback) {
    // Add to queue if already writing
    if (this.isWriting) {
      this.writeQueue.push({ items, callback });
      return;
    }

    this.isWriting = true;
    
    const content = JSON.stringify(items, null, 2);
    fs.writeFile(this.filePath, content, (writeErr) => {
      this.isWriting = false;
      callback(writeErr);
      this.processWriteQueue();
    });
  }

  /**
   * Process queued write operations
   */
  processWriteQueue() {
    if (this.writeQueue.length > 0 && !this.isWriting) {
      const { items, callback } = this.writeQueue.shift();
      this.writeAll(items, callback);
    }
  }
}

export default JsonFileCRUD;
