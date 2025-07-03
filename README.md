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

// Read
db.read('id', (err, data) => {
  console.log('Data:', data);
});

// Update
db.update('id', { age: 31 }, (err, result) => {
  console.log('Updated:', result);
});

// Delete
db.delete('id', (err) => {
  console.log('Deleted');
});
```

## License

MIT
