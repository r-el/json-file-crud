import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-create-data.json";
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
      // Clean up test file
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
      process.exit(passed === total ? 0 : 1);
    }
  });
}

// Clean up and start fresh
if (fs.existsSync(testFile)) {
  fs.unlinkSync(testFile);
}

// Test create single item
test('create single item works', (done) => {
  crud.create({ id: 1, name: "Ariel" }, (err, item) => {
    if (err) return done(err);
    if (item.name === "Ariel") return done(null, true);
    done(new Error('wrong item data'));
  });
});

// Test create and verify item exists
test('create and verify item exists', (done) => {
  crud.create({ id: 2, name: "Yoni" }, (err, item) => {
    if (err) return done(err);
    
    // Verify it was saved
    crud.findById(2, (err2, foundItem) => {
      if (err2) return done(err2);
      if (foundItem && foundItem.name === "Yoni") return done(null, true);
      done(new Error('item not found after create'));
    });
  });
});

// Test create multiple items
test('create multiple items works', (done) => {
  crud.create({ id: 3, name: "Moshe" }, (err, item) => {
    if (err) return done(err);
    
    crud.create({ id: 4, name: "Nissim" }, (err2, item2) => {
      if (err2) return done(err2);
      
      // Verify both items exist
      crud.count((err3, count) => {
        if (err3) return done(err3);
        // Should have 4 items total (from previous tests)
        if (count === 4) return done(null, true);
        done(new Error(`expected 4 items, got ${count}`));
      });
    });
  });
});

// Test concurrent creates (queue test)
test('concurrent creates work with queue', (done) => {
  // Create a separate instance for this test
  const testFile2 = "./test-concurrent-data.json";
  const crud2 = new JsonFileCRUD(testFile2);
  
  // Clean up test file
  if (fs.existsSync(testFile2)) {
    fs.unlinkSync(testFile2);
  }
  
  let completedCreates = 0;
  const totalCreates = 3;
  
  // Create multiple items at the same time
  crud2.create({ id: 10, name: "Concurrent1" }, (err, item) => {
    if (err) return done(err);
    completedCreates++;
    checkCompletion();
  });
  
  crud2.create({ id: 11, name: "Concurrent2" }, (err, item) => {
    if (err) return done(err);
    completedCreates++;
    checkCompletion();
  });
  
  crud2.create({ id: 12, name: "Concurrent3" }, (err, item) => {
    if (err) return done(err);
    completedCreates++;
    checkCompletion();
  });
  
  function checkCompletion() {
    if (completedCreates === totalCreates) {
      // All creates completed, now verify all items exist
      crud2.count((err, count) => {
        // Clean up test file
        if (fs.existsSync(testFile2)) {
          fs.unlinkSync(testFile2);
        }
        
        if (err) return done(err);
        if (count === 3) return done(null, true);
        done(new Error(`expected 3 items, got ${count}`));
      });
    }
  }
});

// Test create with different data types
test('create with different data types works', (done) => {
  const complexItem = {
    id: 5,
    name: "Moshe",
    age: 30,
    active: true,
    tags: ["test", "demo"],
    profile: { city: "Jerusalem", country: "Israel" }
  };
  
  crud.create(complexItem, (err, item) => {
    if (err) return done(err);
    
    // Verify complex data was saved correctly
    crud.findById(5, (err2, foundItem) => {
      if (err2) return done(err2);
      if (foundItem && foundItem.name === "Moshe" && foundItem.age === 30 && foundItem.active === true) {
        return done(null, true);
      }
      done(new Error('complex item not saved correctly'));
    });
  });
});
