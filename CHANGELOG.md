# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
