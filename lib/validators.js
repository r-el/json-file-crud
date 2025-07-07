/**
 * Validation utilities for JsonFileCRUD
 * @version 1.0.0
 */

import { ERROR_MESSAGES } from './constants.js';

/**
 * Validate item data
 * @param {any} item - Item to validate
 * @returns {Error|null} Error if validation fails, null otherwise
 */
export function validateItem(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return new Error(ERROR_MESSAGES.ITEM_MUST_BE_OBJECT);
  }
  return null;
}

/**
 * Create standardized "not found" error
 * @param {string} idField - Name of ID field
 * @param {any} id - ID that was not found
 * @returns {Error} Error object
 */
export function createNotFoundError(idField, id) {
  return new Error(ERROR_MESSAGES.NOT_FOUND(idField, id));
}

/**
 * Create duplicate ID error
 * @param {string} idField - Name of ID field
 * @param {any} id - ID that already exists
 * @returns {Error} Error object
 */
export function createDuplicateIdError(idField, id) {
  return new Error(ERROR_MESSAGES.DUPLICATE_ID(idField, id));
}

/**
 * Create cannot change ID error
 * @param {string} idField - Name of ID field
 * @returns {Error} Error object
 */
export function createCannotChangeIdError(idField) {
  return new Error(ERROR_MESSAGES.CANNOT_CHANGE_ID(idField));
}
