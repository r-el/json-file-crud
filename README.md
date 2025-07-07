# JsonFileCRUD

A simple, robust, and thread-safe CRUD library for managing JSON objects in files using Node.js.

## Features

- **Simple API** - Easy to use CRUD operations
- **Thread-safe** - Sequential operations with automatic queuing
- **Auto-ID assignment** - Automatic ID generation for new items
- **Configurable ID field** - Use any field name as the primary key
- **Comprehensive error handling** - Detailed error messages and validation
- **Zero dependencies** - Built with only Node.js built-in modules
- **ESM support** - Full ES modules support

## Installation

```bash
npm install json-file-crud
```

## Quick Start

```javascript
import JsonFileCRUD from 'json-file-crud';

const db = new JsonFileCRUD('./data.json');

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

- `filePath` (string): Path to the JSON file
- `options` (object, optional):
  - `idField` (string): Name of the ID field (default: 'id')

```javascript
// Default ID field
const db = new JsonFileCRUD('./data.json');

// Custom ID field
const products = new JsonFileCRUD('./products.json', { idField: 'productId' });
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

### Auto-ID Assignment

When creating items without an ID, JsonFileCRUD automatically assigns the next available numeric ID:

```javascript
db.create({ name: 'John' }, (err, result) => {
  // result: { name: 'John', id: 1 }
});

db.create({ name: 'Jane' }, (err, result) => {
  // result: { name: 'Jane', id: 2 }
});
```

### Concurrent Operations

All write operations are automatically queued to prevent race conditions:

```javascript
// These will be executed sequentially, not simultaneously
db.create({ name: 'User 1' }, callback1);
db.create({ name: 'User 2' }, callback2);
db.update(1, { active: true }, callback3);
```

### Custom ID Fields

You can use any field name as the primary key:

```javascript
const products = new JsonFileCRUD('./products.json', { idField: 'productId' });

products.create({ name: 'Laptop', price: 999 }, (err, product) => {
  // product: { name: 'Laptop', price: 999, productId: 1 }
});
```

### Error Handling

JsonFileCRUD provides detailed error messages for common scenarios:

```javascript
// Validation errors
db.create(null, (err) => {
  // err.message: "Item must be an object"
});

// Not found errors
db.findById(999, (err) => {
  // err.message: "Item with id 999 not found"
});

// Duplicate ID errors
db.create({ id: 1, name: 'Duplicate' }, (err) => {
  // err.message: "Item with id 1 already exists"
});
```

## Examples

For comprehensive examples, see the [examples](./examples/) directory:

- **[Basic Usage](./examples/basic-usage.js)** - Simple CRUD operations
- **[Advanced Features](./examples/advanced-usage.js)** - Concurrent operations, filtering, custom ID fields
- **[User Management](./examples/user-management.js)** - Real-world application example

To run examples:

```bash
cd examples
node basic-usage.js
```

## TypeScript Support

While this library is written in JavaScript, you can use it in TypeScript projects. Type definitions may be added in future versions.

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

- **TypeScript Support**: Add TypeScript type definitions (.d.ts files)
- **Async/Await Support**: Add Promise-based API alongside callbacks
- **Batch Operations**: Add bulk insert/update/delete operations
- **File Locking**: Add file locking for multi-process safety
- **Documentation**: Improve documentation and add more examples

### How to Contribute

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Write Tests**: Ensure your changes are well-tested
4. **Follow Code Style**: Keep the code clean and consistent
5. **Update Documentation**: Add or update relevant documentation
6. **Submit a Pull Request**: Describe your changes clearly

## License

MIT License - see [LICENSE](./LICENSE) file for details.

