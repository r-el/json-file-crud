import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-advanced-create-data.json";
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

// Test auto-ID assignment
test('auto-ID assignment works', (done) => {
  crud.create({ name: "Ariel" }, (err, item) => {
    if (err) return done(err);
    if (item.id === 1 && item.name === "Ariel") return done(null, true);
    done(new Error('auto-ID failed'));
  });
});

// Test sequential auto-ID assignment
test('sequential auto-ID assignment works', (done) => {
  crud.create({ name: "Yoni" }, (err, item) => {
    if (err) return done(err);
    if (item.id === 2 && item.name === "Yoni") return done(null, true);
    done(new Error('sequential auto-ID failed'));
  });
});

// Test manual ID assignment
test('manual ID assignment works', (done) => {
  crud.create({ id: 10, name: "Moshe" }, (err, item) => {
    if (err) return done(err);
    if (item.id === 10 && item.name === "Moshe") return done(null, true);
    done(new Error('manual ID failed'));
  });
});

// Test auto-ID after manual ID
test('auto-ID after manual ID works', (done) => {
  crud.create({ name: "Nissim" }, (err, item) => {
    if (err) return done(err);
    // Should get ID 11 (10 + 1)
    if (item.id === 11 && item.name === "Nissim") return done(null, true);
    done(new Error(`expected ID 11, got ${item.id}`));
  });
});

// Test duplicate ID prevention
test('duplicate ID prevention works', (done) => {
  crud.create({ id: 10, name: "Duplicate" }, (err, item) => {
    if (err && err.message.includes('already exists')) return done(null, true);
    done(new Error('should have failed for duplicate ID'));
  });
});

// Test auto-ID with gaps
test('auto-ID with gaps works', (done) => {
  // Delete item with ID 2 to create gap
  crud.delete(2, (err) => {
    if (err) return done(err);
    
    // Create new item should get ID 12 (highest + 1), not fill gap
    crud.create({ name: "NewItem" }, (err, item) => {
      if (err) return done(err);
      if (item.id === 12) return done(null, true);
      done(new Error(`expected ID 12, got ${item.id}`));
    });
  });
});

// Test concurrent creates with auto-ID
test('concurrent creates with auto-ID work', (done) => {
  let completedCreates = 0;
  const totalCreates = 3;
  const createdIds = [];
  
  // Create multiple items without IDs at the same time
  crud.create({ name: "Concurrent1" }, (err, item) => {
    if (err) return done(err);
    createdIds.push(item.id);
    completedCreates++;
    checkCompletion();
  });
  
  crud.create({ name: "Concurrent2" }, (err, item) => {
    if (err) return done(err);
    createdIds.push(item.id);
    completedCreates++;
    checkCompletion();
  });
  
  crud.create({ name: "Concurrent3" }, (err, item) => {
    if (err) return done(err);
    createdIds.push(item.id);
    completedCreates++;
    checkCompletion();
  });
  
  function checkCompletion() {
    if (completedCreates === totalCreates) {
      // All IDs should be unique and numeric
      const uniqueIds = [...new Set(createdIds)];
      if (uniqueIds.length === 3 && uniqueIds.every(id => typeof id === 'number')) {
        return done(null, true);
      }
      done(new Error(`concurrent auto-ID failed: ${createdIds}`));
    }
  }
});

// Test empty database auto-ID
test('empty database auto-ID works', (done) => {
  // Create new instance with different file
  const testFile2 = "./test-empty-auto-id.json";
  const crud2 = new JsonFileCRUD(testFile2);
  
  // Clean up test file
  if (fs.existsSync(testFile2)) {
    fs.unlinkSync(testFile2);
  }
  
  crud2.create({ name: "FirstItem" }, (err, item) => {
    // Clean up
    if (fs.existsSync(testFile2)) {
      fs.unlinkSync(testFile2);
    }
    
    if (err) return done(err);
    if (item.id === 1) return done(null, true);
    done(new Error(`expected ID 1, got ${item.id}`));
  });
});

// Test validation errors
test('create validation works', (done) => {
  crud.create(null, (err, item) => {
    if (err && err.message.includes('must be an object')) {
      // Test with array
      crud.create([], (err2, item2) => {
        if (err2 && err2.message.includes('must be an object')) {
          // Test with string
          crud.create("invalid", (err3, item3) => {
            if (err3 && err3.message.includes('must be an object')) {
              return done(null, true);
            }
            done(new Error('should have failed for string'));
          });
        } else {
          done(new Error('should have failed for array'));
        }
      });
    } else {
      done(new Error('should have failed for null'));
    }
  });
});

// Test update validation
test('update validation works', (done) => {
  // First create an item to update
  crud.create({ name: "TestUpdate" }, (err, item) => {
    if (err) return done(err);
    
    // Test invalid data types
    crud.update(item.id, null, (err2) => {
      if (err2 && err2.message.includes('must be an object')) {
        crud.update(item.id, [], (err3) => {
          if (err3 && err3.message.includes('must be an object')) {
            return done(null, true);
          }
          done(new Error('should have failed for array'));
        });
      } else {
        done(new Error('should have failed for null'));
      }
    });
  });
});

// Test ID field protection
test('ID field protection works', (done) => {
  // First create an item
  crud.create({ name: "TestIDProtection" }, (err, item) => {
    if (err) return done(err);
    
    const originalId = item.id;
    // Try to change the ID
    crud.update(originalId, { id: 999, name: "Updated" }, (err2) => {
      if (err2 && err2.message.includes('Cannot change')) {
        // Verify item wasn't changed
        crud.findById(originalId, (err3, foundItem) => {
          if (err3) return done(err3);
          if (foundItem && foundItem.name === "TestIDProtection") {
            return done(null, true);
          }
          done(new Error('item was unexpectedly changed'));
        });
      } else {
        done(new Error('should have prevented ID change'));
      }
    });
  });
});
