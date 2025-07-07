import JsonFileCRUD, { createCrud } from '../lib/json-file-crud.js';
import fs from 'fs';

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
  if (!crud || !crud.filePath.endsWith('test.json')) {
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
  ['create', 'findById', 'update', 'delete'].forEach(method => {
    if (typeof crud[method] !== 'function') {
      throw new Error(`missing ${method} method`);
    }
  });
});

// createCrud convenience function
test('createCrud convenience function works', () => {
  const testFile = "./test-create-crud.json";
  
  // Clean up
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
  
  const convenienceCrud = createCrud(testFile);
  
  if (!convenienceCrud || typeof convenienceCrud.create !== 'function') {
    throw new Error('createCrud failed to create valid instance');
  }
  
  // Clean up
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
});

// Directory creation
test('automatically creates directories', () => {
  const deepPath = "./test-deep/nested/directory/data.json";
  
  // Create instance (should create directories)
  const deepCrud = new JsonFileCRUD(deepPath);
  
  if (!deepCrud || !deepCrud.filePath.includes('test-deep')) {
    // Clean up
    fs.rmSync("./test-deep", { recursive: true, force: true });
    throw new Error('failed to create instance with deep path');
  }
  
  // Clean up
  fs.rmSync("./test-deep", { recursive: true, force: true });
});

console.log(`\n${passed}/${total} tests passed`);
process.exit(passed === total ? 0 : 1);
