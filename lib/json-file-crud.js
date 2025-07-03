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
    }

    create(data, callback) {
        // TODO: implement create
    }

    read(id, callback) {
        // TODO: implement read
    }

    update(id, data, callback) {
        // TODO: implement update
    }

    delete(id, callback) {
        // TODO: implement delete
    }

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
}

export default JsonFileCRUD;
