# Examples

This directory contains practical examples demonstrating how to use JsonFileCRUD in different scenarios.

## Getting Started

To run any example:

```bash
cd examples
node <example-name>.js
```

## Available Examples

### 1. `basic-usage.js` - Basic CRUD Operations

Learn the fundamentals of JsonFileCRUD:

- Creating items
- Reading all items
- Finding items by ID
- Updating items
- Deleting items
- Counting items

**Run:** `node basic-usage.js`

### 2. `advanced-usage.js` - Advanced Features

Explore advanced capabilities:

- Concurrent operations (automatic queuing)
- Custom ID fields
- Advanced filtering with `findBy()`
- Batch operations
- Error handling patterns

**Run:** `node advanced-usage.js`

### 3. `user-management.js` - Real-World Application

See how to build a complete user management system:

- User registration
- Profile management
- Role-based access
- Soft deletion (deactivation)
- Advanced queries

**Run:** `node user-management.js`

## Data Files

Examples will create JSON files in the `data/` directory:

- `users.json` - Basic usage data
- `products.json` - Advanced usage data
- `users-system.json` - User management data

## Cleanup

To clean up example data files:

```bash
rm -rf examples/data/*.json
```

## Tips

1. **Start with basic-usage.js** to understand the fundamentals
2. **Check the data files** after running examples to see the JSON structure
3. **Modify the examples** to experiment with your own data
4. **Use the patterns** from these examples in your own projects

## Next Steps

After running the examples:

1. Read the [main README](../README.md) for complete API documentation
2. Check the [test files](../test/) for more usage patterns
3. Start building your own application!
