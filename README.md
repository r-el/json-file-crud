# JsonFileCRUD

A simple, robust, and thread-safe CRUD library for managing JSON objects in files using Node.js.

## Features

- **Simple API** - Easy to use CRUD operations
- **Thread-safe** - Sequential operations with automatic queuing
- **Auto-ID assignment** - Automatic ID generation for new items (configurable)
- **Unique Fields** - Prevent duplicate values in specified fields ✨ *New in v1.1*
- **Concurrent Operations** - Thread-safe operations with automatic queuing
- **Custom ID Fields** - Use any field name as the primary key (default: 'id')
- **Directory Creation** - Automatically creates directories if they don't exist ✨ *New in v1.1*
- **Convenience Functions** - Helper functions for quick setup ✨ *New in v1.1*
- **TypeScript Support** - Full TypeScript definitions for IDE support ✨ *New in v1.2*
- **Error Handling** - Comprehensive error handling and detailed error messages
- **Zero dependencies** - Built with only Node.js built-in modules
- **ESM support** - Full ES modules support

## Installation

```bash
npm install json-file-crud
```

## Quick Start

```javascript
import JsonFileCRUD, { createCrud } from 'json-file-crud';

// Standard usage
const db = new JsonFileCRUD('./data.json');

// Quick setup with convenience function
const db2 = createCrud('./users.json');

// Advanced configuration with unique fields
const userDb = new JsonFileCRUD('./users.json', {
  uniqueFields: ['email', 'username'],
  autoId: true
});

// Create a new item
db.create({ name: 'John', age: 30 }, (err, result) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Created:', result); // { name: 'John', age: 30, id: 1 }
});

// Read all items
db.readAll((err, items) => {
  if (err) throw err;
  console.log('All items:', items);
});

// Find by ID
db.findById(1, (err, item) => {
  if (err) throw err;
  console.log('Found:', item);
});

// Update an item
db.update(1, { age: 31 }, (err, updatedItem) => {
  if (err) throw err;
  console.log('Updated:', updatedItem);
});

// Delete an item
db.delete(1, (err, deletedItem) => {
  if (err) throw err;
  console.log('Deleted:', deletedItem);
});
```

## API Reference

### Constructor

#### `new JsonFileCRUD(filePath, options)`

Creates a new JsonFileCRUD instance.

- `filePath` (string): Path to the JSON file (directories will be created if they don't exist)
- `options` (object, optional):
  - `idField` (string): Name of the ID field (default: 'id')
  - `uniqueFields` (array): Array of field names that must be unique (default: [])
  - `autoId` (boolean): Enable automatic ID assignment (default: true)

```javascript
// Default settings
const db = new JsonFileCRUD('./data.json');

// Custom ID field
const products = new JsonFileCRUD('./products.json', { idField: 'productId' });

// Unique fields validation
const users = new JsonFileCRUD('./users.json', { 
  uniqueFields: ['email', 'username'] 
});

// Disable auto-ID
const manualDb = new JsonFileCRUD('./manual.json', { autoId: false });

// Deep directory path (automatically created)
const deepDb = new JsonFileCRUD('./data/nested/deep/file.json');
```

### Convenience Functions

#### `createCrud(filePath, options)`

Quick way to create a JsonFileCRUD instance.

```javascript
import { createCrud } from 'json-file-crud';

const db = createCrud('./data.json', { uniqueFields: ['email'] });
```

### CRUD Operations

#### `create(item, callback)`

Creates a new item. Auto-assigns an ID if not provided.

- `item` (object): The item to create
- `callback` (function): `(error, createdItem) => {}`

```javascript
db.create({ name: 'Alice', email: 'alice@example.com' }, (err, result) => {
  // result: { name: 'Alice', email: 'alice@example.com', id: 1 }
});
```

#### `readAll(callback)`

Reads all items from the file.

- `callback` (function): `(error, items) => {}`

```javascript
db.readAll((err, items) => {
  // items: array of all items
});
```

#### `findById(id, callback)`

Finds an item by its ID.

- `id` (any): The ID to search for
- `callback` (function): `(error, item) => {}`

```javascript
db.findById(1, (err, item) => {
  // item: the found item or null if not found
});
```

#### `findBy(filterFunction, callback)`

Finds items that match a filter function.

- `filterFunction` (function): Function that returns true for matching items
- `callback` (function): `(error, items) => {}`

```javascript
// Find all adults
db.findBy(item => item.age >= 18, (err, adults) => {
  // adults: array of matching items
});

// Find by name
db.findBy(item => item.name === 'John', (err, johns) => {
  // johns: array of items named John
});
```

#### `update(id, data, callback)`

Updates an existing item.

- `id` (any): The ID of the item to update
- `data` (object): The data to update (merged with existing item)
- `callback` (function): `(error, updatedItem) => {}`

```javascript
db.update(1, { age: 25, city: 'New York' }, (err, updated) => {
  // updated: the item with merged data
});
```

#### `delete(id, callback)`

Deletes an item by ID.

- `id` (any): The ID of the item to delete
- `callback` (function): `(error, deletedItem) => {}`

```javascript
db.delete(1, (err, deleted) => {
  // deleted: the item that was removed
});
```

#### `deleteAll(callback)`

Deletes all items from the database.

- `callback` (function): `(error) => {}`

```javascript
db.deleteAll((err) => {
  if (err) throw err;
  console.log('All items deleted');
});
```

#### `count(callback)`

Returns the total number of items.

- `callback` (function): `(error, count) => {}`

```javascript
db.count((err, total) => {
  console.log('Total items:', total);
});
```

#### `writeAll(items, callback)`

Replaces all data in the file with a new array of items.

- `items` (array): Array of items to write
- `callback` (function): `(error) => {}`

```javascript
const newData = [
  { name: 'Item 1', id: 1 },
  { name: 'Item 2', id: 2 }
];

db.writeAll(newData, (err) => {
  if (!err) console.log('Data replaced successfully');
});
```

## Advanced Features

### Unique Fields

Prevent duplicate values in specified fields:

```javascript
const userDb = new JsonFileCRUD('./users.json', {
  uniqueFields: ['email', 'username']
});

// This will fail if email already exists
userDb.create({ 
  name: 'John', 
  email: 'john@example.com' 
}, (err, user) => {
  // err.message: "Item with email 'john@example.com' already exists"
});
```

### Auto-ID Control

Disable automatic ID assignment:

```javascript
const db = new JsonFileCRUD('./data.json', { autoId: false });

// No ID will be auto-generated
db.create({ name: 'Test' }, (err, item) => {
  // item: { name: 'Test' } (no id field)
});
```

### Directory Creation

Automatically creates directories for deep paths:

```javascript
// This will create ./data/users/ directories if they don't exist
const db = new JsonFileCRUD('./data/users/profiles.json');
```

## Examples

For comprehensive examples, see the [examples](./examples/) directory:

- **[Basic Usage](./examples/basic-usage.js)** - Simple CRUD operations
- **[Advanced Features](./examples/advanced-usage.js)** - Concurrent operations, filtering, custom ID fields  
- **[User Management](./examples/user-management.js)** - Real-world application with unique fields validation

### Quick Examples

```javascript
// Basic usage with unique fields
import JsonFileCRUD, { createCrud } from 'json-file-crud';

const userDb = createCrud('./users.json', {
  uniqueFields: ['email', 'username']
});

// Delete all users
userDb.deleteAll((err) => {
  console.log('All users deleted');
});

// Example with auto-ID disabled
const manualDb = new JsonFileCRUD('./manual.json', { autoId: false });
manualDb.create({ name: 'Test' }, (err, item) => {
  // item: { name: 'Test' } (no auto-generated ID)
});
```

To run examples:

```bash
npm run examples
# or individually:
node examples/basic-usage.js
```

## TypeScript Support

Type definitions are provided via `lib/json-file-crud.d.ts` so the library can be used comfortably in TypeScript projects with autocompletion and compile-time checks.

## File Format

JsonFileCRUD stores data as a JSON array in the specified file:

```json
[
  { "id": 1, "name": "John", "age": 30 },
  { "id": 2, "name": "Jane", "age": 25 }
]
```

If the file doesn't exist, it will be created automatically on the first write operation.

## Performance Considerations

- **Small to medium datasets**: JsonFileCRUD is ideal for applications with up to ~10,000 items
- **File I/O**: Every operation reads/writes the entire file, so performance scales with file size
- **Memory usage**: The entire dataset is loaded into memory during operations
- **Concurrent access**: Operations are queued, so high-concurrency scenarios may experience delays

For larger datasets or high-performance requirements, consider using a dedicated database.

## Contributing

Contributions are welcome! Here are some ways you can help improve JsonFileCRUD:

### Ideas for Contributions

- **Async/Await Support**: Add Promise-based API alongside callbacks
- **Batch Operations**: Add bulk insert/update/delete operations
- **File Locking**: Add file locking for multi-process safety
- **Enhanced Documentation**: Improve documentation and add more examples

### How to Contribute

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Write Tests**: Ensure your changes are well-tested
4. **Follow Code Style**: Keep the code clean and consistent
5. **Update Documentation**: Add or update relevant documentation
6. **Submit a Pull Request**: Describe your changes clearly

## License

MIT License - see [LICENSE](./LICENSE) file for details.

