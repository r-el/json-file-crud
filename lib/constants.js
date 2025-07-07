/**
 * Constants and configuration for JsonFileCRUD
 * @version 1.0.0
 */

export const OPERATION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  DELETE_ALL: 'deleteAll',
  WRITE_ALL: 'writeAll'
};

export const ERROR_MESSAGES = {
  ITEM_MUST_BE_OBJECT: 'Item must be an object',
  DUPLICATE_ID: (idField, id) => `Item with ${idField} ${id} already exists`,
  NOT_FOUND: (idField, id) => `Item with ${idField} ${id} not found`,
  CANNOT_CHANGE_ID: (idField) => `Cannot change ${idField} field`,
  FILE_PATH_REQUIRED: 'File path is required',
  INVALID_JSON_ARRAY: 'File content is not a JSON array'
};

export const DEFAULT_CONFIG = {
  ID_FIELD: 'id',
  AUTO_ID: true,
  UNIQUE_FIELDS: []
};
