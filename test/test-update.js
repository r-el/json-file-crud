import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-update-data.json";
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
        resolve();
      });
    });
  });
};

// Wait for setup, then run tests
setupData()
  .then(() => {
    runTests();
  })
  .catch((err) => {
    console.log("Setup failed:", err.message);
    process.exit(1);
  });

function runTests() {
  // Test basic update
  test("basic update works", (done) => {
    crud.update(1, { age: 26 }, (err, item) => {
      if (err) return done(err);
      if (item.age === 26 && item.name === "Ariel") return done(null, true);
      done(new Error("update failed"));
    });
  });

  // Test update and verify
  test("update and verify works", (done) => {
    crud.update(2, { city: "Haifa", age: 31 }, (err, item) => {
      if (err) return done(err);

      // Verify update was saved
      crud.findById(2, (err2, foundItem) => {
        if (err2) return done(err2);
        if (foundItem && foundItem.city === "Haifa" && foundItem.age === 31 && foundItem.name === "Yoni") {
          return done(null, true);
        }
        done(new Error("update not saved correctly"));
      });
    });
  });

  // Test update non-existent item
  test("update non-existent item fails", (done) => {
    crud.update(999, { name: "NotFound" }, (err, item) => {
      if (err && err.message.includes("not found")) return done(null, true);
      done(new Error("should have failed for non-existent item"));
    });
  });

  // Test update with new fields
  test("update with new fields works", (done) => {
    crud.update(1, { email: "ariel@example.com", active: true }, (err, item) => {
      if (err) return done(err);

      // Verify new fields were added
      crud.findById(1, (err2, foundItem) => {
        if (err2) return done(err2);
        if (foundItem && foundItem.email === "ariel@example.com" && foundItem.active === true) {
          return done(null, true);
        }
        done(new Error("new fields not added correctly"));
      });
    });
  });

  // Test concurrent updates (queue test)
  test("concurrent updates work with queue", (done) => {
    let completedUpdates = 0;
    const totalUpdates = 2;

    // Update multiple items at the same time
    crud.update(1, { status: "updated1" }, (err, item) => {
      if (err) return done(err);
      completedUpdates++;
      checkCompletion();
    });

    crud.update(2, { status: "updated2" }, (err, item) => {
      if (err) return done(err);
      completedUpdates++;
      checkCompletion();
    });

    function checkCompletion() {
      if (completedUpdates === totalUpdates) {
        // Verify both updates worked
        crud.findById(1, (err, item1) => {
          if (err) return done(err);
          crud.findById(2, (err2, item2) => {
            if (err2) return done(err2);
            if (item1.status === "updated1" && item2.status === "updated2") {
              return done(null, true);
            }
            done(new Error("concurrent updates failed"));
          });
        });
      }
    }
  });
}
