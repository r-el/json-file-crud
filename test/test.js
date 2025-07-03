import JsonFileCRUD from '../lib/json-file-crud.js';

let passed = 0;
let total = 0;

function test(description, testFn) {
  total++;
  try {
    testFn();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}: ${error.message}`);
  }
}

// Basic constructor test
test('creates instance with file path', () => {
  const crud = new JsonFileCRUD('./test.json');
  if (!crud || crud.filePath !== './test.json') {
    throw new Error('failed to create instance');
  }
});

// Constructor validation
test('requires file path', () => {
  try {
    new JsonFileCRUD();
    throw new Error('should throw error');
  } catch (error) {
    if (error.message !== 'File path is required') {
      throw error;
    }
  }
});

// Method availability
test('has required methods', () => {
  const crud = new JsonFileCRUD('./test.json');
  ['create', 'read', 'update', 'delete'].forEach(method => {
    if (typeof crud[method] !== 'function') {
      throw new Error(`missing ${method} method`);
    }
  });
});

console.log(`\n${passed}/${total} tests passed`);
process.exit(passed === total ? 0 : 1);
