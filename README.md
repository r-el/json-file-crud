# JsonFileCRUD

CRUD operations for JSON files.

## Install

```bash
npm install json-file-crud
```

## Usage

```javascript
import JsonFileCRUD from 'json-file-crud';

const db = new JsonFileCRUD('./data.json');

// Create
db.create({ name: 'John', age: 30 }, (err, result) => {
  console.log('Created:', result);
});

// Read by ID
db.findById(1, (err, item) => {
  console.log('Item:', item);
});

// Read all
db.readAll((err, items) => {
  console.log('All items:', items);
});

// Update
db.update(1, { age: 31 }, (err, result) => {
  console.log('Updated:', result);
});

// Delete
db.delete(1, (err, deletedItem) => {
  console.log('Deleted:', deletedItem);
});
```

## License

MIT
