import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
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
      process.exit(passed === total ? 0 : 1);
    }
  });
}

function cleanupFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

// Test unique fields in create
test('unique fields prevent duplicates in create', (done) => {
  const testFile = "./test-unique-create.json";
  cleanupFile(testFile);
  
  const crud = new JsonFileCRUD(testFile, { 
    uniqueFields: ['email', 'username'] 
  });
  
  crud.create({ name: "Ariel", email: "ariel@example.com", username: "ariel123" }, (err, item1) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }
    
    // Try to create another item with same email
    crud.create({ name: "Yoni", email: "ariel@example.com", username: "yoni456" }, (err2, item2) => {
      if (err2 && err2.message.includes("email")) {
        // Try to create another item with same username
        crud.create({ name: "Moshe", email: "moshe@example.com", username: "ariel123" }, (err3, item3) => {
          cleanupFile(testFile);
          if (err3 && err3.message.includes("username")) {
            return done(null, true);
          }
          done(new Error(`should have failed for duplicate username, got: ${err3?.message || 'no error'}`));
        });
      } else {
        cleanupFile(testFile);
        done(new Error(`should have failed for duplicate email, got: ${err2?.message || 'no error'}`));
      }
    });
  });
});

// Test unique fields in update
test('unique fields prevent duplicates in update', (done) => {
  const testFile = "./test-unique-update.json";
  cleanupFile(testFile);
  
  const crud = new JsonFileCRUD(testFile, { 
    uniqueFields: ['email', 'username'] 
  });
  
  // First create two items
  crud.create({ name: "UpdateUser1", email: "updateuser1@example.com", username: "updateuser1" }, (err, item1) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }
    
    crud.create({ name: "UpdateUser2", email: "updateuser2@example.com", username: "updateuser2" }, (err2, item2) => {
      if (err2) {
        cleanupFile(testFile);
        return done(err2);
      }
      
      // Try to update item2 with item1's email
      crud.update(item2.id, { email: "updateuser1@example.com" }, (err3, updatedItem) => {
        cleanupFile(testFile);
        if (err3 && err3.message.includes("email")) {
          return done(null, true);
        }
        done(new Error('should have failed for duplicate email in update'));
      });
    });
  });
});

// Test autoId can be disabled
test('autoId can be disabled', (done) => {
  const testFile = "./test-auto-id-disabled.json";
  cleanupFile(testFile);
  
  const crud = new JsonFileCRUD(testFile, { autoId: false });
  
  // Create item without ID (should work when autoId is disabled)
  crud.create({ name: "NoAutoId" }, (err, item) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }
    
    // Should not have auto-generated ID
    if (item.id === undefined) {
      cleanupFile(testFile);
      return done(null, true);
    }
    
    cleanupFile(testFile);
    done(new Error('should not have auto-generated ID when autoId is false'));
  });
});

// Test autoId enabled (default)
test('autoId works when enabled', (done) => {
  const testFile = "./test-auto-id-enabled.json";
  cleanupFile(testFile);
  
  const crud = new JsonFileCRUD(testFile, { autoId: true });
  
  // Create item without ID (should get auto-generated ID)
  crud.create({ name: "WithAutoId" }, (err, item) => {
    cleanupFile(testFile);
    if (err) return done(err);
    
    // Should have auto-generated ID
    if (item.id === 1) {
      return done(null, true);
    }
    
    done(new Error(`expected auto-generated ID of 1, got: ${item.id}`));
  });
});
