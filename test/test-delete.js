import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-delete-data.json";
const crud = new JsonFileCRUD(testFile);
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

// Setup test data
const setupData = () => {
  return new Promise((resolve, reject) => {
    crud.create({ id: 1, name: "Ariel", age: 25, city: "Tel Aviv" }, (err) => {
      if (err) return reject(err);
      crud.create({ id: 2, name: "Yoni", age: 30, city: "Jerusalem" }, (err) => {
        if (err) return reject(err);
        crud.create({ id: 3, name: "Moshe", age: 35, city: "Haifa" }, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    });
  });
};

// Wait for setup, then run tests
setupData()
  .then(() => {
    runSequentialTests();
  })
  .catch((err) => {
    console.log("Setup failed:", err.message);
    process.exit(1);
  });

function runSequentialTests() {
  // Test 1: Basic delete
  crud.delete(1, (err, deletedItem) => {
    if (err) {
      console.log("✗ basic delete works:", err.message);
      process.exit(1);
    }

    if (deletedItem && deletedItem.name === "Ariel") {
      console.log("✓ basic delete works");

      // Test 2: Delete and verify removal
      crud.delete(2, (err, deletedItem) => {
        if (err) {
          console.log("✗ delete and verify removal works:", err.message);
          process.exit(1);
        }

        // Verify item was deleted
        crud.findById(2, (err2, foundItem) => {
          if (err2 && err2.message.includes("not found")) {
            console.log("✓ delete and verify removal works");

            // Test 3: Count after deletions
            crud.count((err, count) => {
              if (err) {
                console.log("✗ count after deletions works:", err.message);
                process.exit(1);
              }

              if (count === 1) {
                console.log("✓ count after deletions works");

                // Test 4: Delete non-existent item
                crud.delete(999, (err, deletedItem) => {
                  if (err && err.message.includes("not found")) {
                    console.log("✓ delete non-existent item fails");

                    // Test 5: Delete last remaining item
                    crud.delete(3, (err, deletedItem) => {
                      if (err) {
                        console.log("✗ delete last remaining item works:", err.message);
                        process.exit(1);
                      }

                      // Verify no items left
                      crud.count((err2, count) => {
                        if (err2) {
                          console.log("✗ delete last remaining item works:", err2.message);
                          process.exit(1);
                        }

                        if (count === 0) {
                          console.log("✓ delete last remaining item works");

                          // Test 6: Concurrent deletes
                          testConcurrentDeletes();
                        } else {
                          console.log(`✗ delete last remaining item works: expected 0 items, got ${count}`);
                          process.exit(1);
                        }
                      });
                    });
                  } else {
                    console.log("✗ delete non-existent item fails: should have failed");
                    process.exit(1);
                  }
                });
              } else {
                console.log(`✗ count after deletions works: expected 1 item, got ${count}`);
                process.exit(1);
              }
            });
          } else {
            console.log("✗ delete and verify removal works: item was not deleted");
            process.exit(1);
          }
        });
      });
    } else {
      console.log("✗ basic delete works: delete failed");
      process.exit(1);
    }
  });
}

function testConcurrentDeletes() {
  // First add some items to delete
  crud.create({ id: 10, name: "Test1" }, (err) => {
    if (err) {
      console.log("✗ concurrent deletes work with queue:", err.message);
      process.exit(1);
    }

    crud.create({ id: 11, name: "Test2" }, (err) => {
      if (err) {
        console.log("✗ concurrent deletes work with queue:", err.message);
        process.exit(1);
      }

      let completedDeletes = 0;
      const totalDeletes = 2;

      // Delete multiple items at the same time
      crud.delete(10, (err, item) => {
        if (err) {
          console.log("✗ concurrent deletes work with queue:", err.message);
          process.exit(1);
        }
        completedDeletes++;
        checkCompletion();
      });

      crud.delete(11, (err, item) => {
        if (err) {
          console.log("✗ concurrent deletes work with queue:", err.message);
          process.exit(1);
        }
        completedDeletes++;
        checkCompletion();
      });

      function checkCompletion() {
        if (completedDeletes === totalDeletes) {
          // Verify both items were deleted
          crud.findById(10, (err, item1) => {
            if (err && err.message.includes("not found")) {
              crud.findById(11, (err2, item2) => {
                if (err2 && err2.message.includes("not found")) {
                  console.log("✓ concurrent deletes work with queue");
                  console.log("\n6/6 tests passed");

                  // Final cleanup
                  if (fs.existsSync(testFile)) {
                    fs.unlinkSync(testFile);
                  }
                  process.exit(0);
                } else {
                  console.log("✗ concurrent deletes work with queue: second item not deleted");
                  process.exit(1);
                }
              });
            } else {
              console.log("✗ concurrent deletes work with queue: first item not deleted");
              process.exit(1);
            }
          });
        }
      }
    });
  });
}
