import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-data.json";
const testData = [
  { id: 1, name: "Ariel" },
  { id: 2, name: "Yoni" },
];

// Create test file
fs.writeFileSync(testFile, JSON.stringify(testData));

const crud = new JsonFileCRUD(testFile);
let passed = 0;
let total = 0;
let completed = 0;

function test(description, testFn) {
  total++;
  testFn((err, success) => {
    completed++;
    
    if (err || !success) {
      console.log(`✗ ${description}: ${err?.message || 'failed'}`);
    } else {
      console.log(`✓ ${description}`);
      passed++;
    }
    
    // Check if all async tests are done
    if (completed === total) {
      console.log(`\n${passed}/${total} tests passed`);
      fs.unlinkSync(testFile); // Clean up
      process.exit(passed === total ? 0 : 1);
    }
  });
}

// Test reading all items
test('readAll works', (done) => {
  crud.readAll((err, items) => {
    if (err) return done(err);
    if (items.length === 2) return done(null, true);
    done(new Error('wrong count'));
  });
});

// Test reading single item
test('findById works', (done) => {
  crud.findById(1, (err, item) => {
    if (err) return done(err);
    if (item.name === "Ariel") return done(null, true);
    done(new Error('wrong data'));
  });
});

// Test findById method
test('findById works', (done) => {
  crud.findById(2, (err, item) => {
    if (err) return done(err);
    if (item.name === "Yoni") return done(null, true);
    done(new Error('wrong data'));
  });
});

// Test error handling
test('findById error handling works', (done) => {
  crud.findById(1000, (err, item) => {
    if (err) return done(null, true); // Should fail
    done(new Error('should have failed'));
  });
});
