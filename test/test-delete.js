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
      console.log(`✗ ${description}: ${err?.message || "failed"}`);
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

// Test basic delete
test("basic delete works", (done) => {
  const testFile = "./test-delete-basic.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create test data
  crud.create({ id: 1, name: "Ariel", age: 25, city: "Tel Aviv" }, (err, item) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }

    // Delete the item
    crud.delete(1, (err2, deletedItem) => {
      cleanupFile(testFile);
      if (err2) return done(err2);
      if (deletedItem && deletedItem.name === "Ariel") {
        return done(null, true);
      }
      done(new Error("delete failed"));
    });
  });
});

// Test delete and verify removal
test("delete and verify removal works", (done) => {
  const testFile = "./test-delete-verify.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create test data
  crud.create({ id: 2, name: "Yoni", age: 30, city: "Jerusalem" }, (err, item) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }

    // Delete the item
    crud.delete(2, (err2, deletedItem) => {
      if (err2) {
        cleanupFile(testFile);
        return done(err2);
      }

      // Verify item was deleted
      crud.findById(2, (err3, foundItem) => {
        cleanupFile(testFile);
        if (err3 && err3.message.includes("not found")) {
          return done(null, true);
        }
        done(new Error("item should not be found after deletion"));
      });
    });
  });
});

// Test count after deletions
test("count after deletions works", (done) => {
  const testFile = "./test-delete-count.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create test data
  crud.create({ name: "Item1" }, (err, item1) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }

    crud.create({ name: "Item2" }, (err2, item2) => {
      if (err2) {
        cleanupFile(testFile);
        return done(err2);
      }

      // Delete one item
      crud.delete(item1.id, (err3, deletedItem) => {
        if (err3) {
          cleanupFile(testFile);
          return done(err3);
        }

        // Count remaining items
        crud.count((err4, count) => {
          cleanupFile(testFile);
          if (err4) return done(err4);
          if (count === 1) {
            return done(null, true);
          }
          done(new Error(`expected 1 item, got ${count}`));
        });
      });
    });
  });
});

// Test delete non-existent item
test("delete non-existent item fails", (done) => {
  const testFile = "./test-delete-nonexistent.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Try to delete non-existent item
  crud.delete(999, (err, deletedItem) => {
    cleanupFile(testFile);
    if (err && err.message.includes("not found")) {
      return done(null, true);
    }
    done(new Error("should have failed for non-existent item"));
  });
});

// Test delete last remaining item
test("delete last remaining item works", (done) => {
  const testFile = "./test-delete-last.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create one item
  crud.create({ name: "LastItem" }, (err, item) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }

    // Delete it
    crud.delete(item.id, (err2, deletedItem) => {
      if (err2) {
        cleanupFile(testFile);
        return done(err2);
      }

      // Check count is zero
      crud.count((err3, count) => {
        cleanupFile(testFile);
        if (err3) return done(err3);
        if (count === 0) {
          return done(null, true);
        }
        done(new Error(`expected 0 items, got ${count}`));
      });
    });
  });
});

// Test concurrent deletes
test("concurrent deletes work with queue", (done) => {
  const testFile = "./test-delete-concurrent.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create multiple items
  const items = [];
  let createCount = 0;

  for (let i = 1; i <= 3; i++) {
    crud.create({ name: `Item${i}` }, (err, item) => {
      if (err) {
        cleanupFile(testFile);
        return done(err);
      }

      items.push(item);
      createCount++;

      if (createCount === 3) {
        // Now delete all concurrently
        let deleteCount = 0;

        items.forEach((item) => {
          crud.delete(item.id, (err2, deletedItem) => {
            if (err2) {
              cleanupFile(testFile);
              return done(err2);
            }

            deleteCount++;
            if (deleteCount === 3) {
              // Check final count
              crud.count((err3, count) => {
                cleanupFile(testFile);
                if (err3) return done(err3);
                if (count === 0) {
                  return done(null, true);
                }
                done(new Error(`expected 0 items, got ${count}`));
              });
            }
          });
        });
      }
    });
  }
});

// Test deleteAll
test("deleteAll removes all items", (done) => {
  const testFile = "./test-delete-all.json";
  cleanupFile(testFile);

  const crud = new JsonFileCRUD(testFile);

  // Create some items first
  crud.create({ name: "DeleteAllTest1" }, (err, item1) => {
    if (err) {
      cleanupFile(testFile);
      return done(err);
    }

    crud.create({ name: "DeleteAllTest2" }, (err2, item2) => {
      if (err2) {
        cleanupFile(testFile);
        return done(err2);
      }

      // Now delete all
      crud.deleteAll((err3) => {
        if (err3) {
          cleanupFile(testFile);
          return done(err3);
        }

        crud.count((err4, count) => {
          cleanupFile(testFile);
          if (err4) return done(err4);
          if (count === 0) return done(null, true);
          done(new Error(`expected 0 items, got ${count}`));
        });
      });
    });
  });
});
