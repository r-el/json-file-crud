# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-07-07

### Added
- **Unique Fields Support** - Prevent duplicate values in specified fields
  - Configure unique fields via `uniqueFields` option
  - Automatic validation on create and update operations
  - Clear error messages for duplicate field values
- **Auto-ID Toggle** - Control automatic ID assignment
  - Enable/disable auto-ID with `autoId` option
  - Default behavior remains unchanged (auto-ID enabled)
- **deleteAll Method** - Remove all items from the database
  - Simple `deleteAll(callback)` method
  - Thread-safe operation through existing queue system
- **createCrud Convenience Function** - Quick CRUD instance creation
  - Simplified API: `createCrud(filePath, options)`
  - Exported as named export for easy access
- **Automatic Directory Creation** - Create directories if they don't exist
  - Automatically creates parent directories for file paths
  - No need to manually create directories before using the library

### Enhanced
- **Test Suite Reorganization** - Improved test structure
  - Split tests into logical files by functionality
  - `test-basic.js` - Basic functionality and convenience features
  - `test-config-options.js` - Configuration options (uniqueFields, autoId)
  - `test-delete.js` - Delete operations including deleteAll
  - Total test count increased to 37 tests
- **Configuration Options** - Enhanced constructor options
  - `uniqueFields: string[]` - Array of field names that must be unique
  - `autoId: boolean` - Enable/disable automatic ID assignment
  - Backward compatible with existing code

### Changed
- Package description updated to reflect new features
- Test scripts updated for reorganized test structure

### Technical Details
- All new features maintain backward compatibility
- Thread-safe operations through existing queue system
- Comprehensive error handling for all new features
- Zero breaking changes to existing API

## [1.0.0] - 2025-07-07

### Added
- Initial release of JsonFileCRUD
- Complete CRUD operations (Create, Read, Update, Delete)
- Auto-ID assignment with duplicate prevention
- Configurable ID fields (default: 'id')
- Thread-safe operations with automatic queuing
- Comprehensive error handling and validation
- Zero external dependencies
- Full ESM (ES modules) support
- Comprehensive test suite with 35 tests
- Practical usage examples:
  - Basic CRUD operations
  - Advanced features with concurrent operations
  - User management system example
- Complete API documentation
- Contributing guidelines with improvement ideas

### Features
- **create(item, callback)** - Create new items with auto-ID
- **readAll(callback)** - Read all items from file
- **findById(id, callback)** - Find item by ID
- **findBy(filterFn, callback)** - Find items by custom filter
- **update(id, data, callback)** - Update existing items
- **delete(id, callback)** - Delete items by ID
- **count(callback)** - Get total item count
- **writeAll(items, callback)** - Replace all data

### Performance
- Optimized for small to medium datasets (up to ~10,000 items)
- Sequential operations prevent race conditions
- Automatic file creation on first write
- Memory-efficient data handling

### Documentation
- Complete README with API reference
- Multiple practical examples
- Error handling guide
- Performance considerations
- Contributing guidelines

## [Unreleased]

### Future Improvements
- TypeScript support with .d.ts files
- Promise-based API (async/await)
- Batch operations (createMany, updateMany, deleteMany)
- File locking for multi-process safety
- Enhanced documentation and examples

---

[1.1.0]: https://github.com/arielweizman/json-file-crud/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/arielweizman/json-file-crud/releases/tag/v1.0.0
