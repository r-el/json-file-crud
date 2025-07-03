import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Simple test setup
const testFile = "./test-data.json";
const testData = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

// Setup test file
fs.writeFileSync(testFile, JSON.stringify(testData));

const crud = new JsonFileCRUD(testFile);

// Test readAll
crud.readAll((err, items) => {
  if (err) {
    console.log("✗ readAll failed:", err.message);
  } else if (items.length === 2) {
    console.log("✓ readAll works");
  } else {
    console.log("✗ readAll wrong count");
  }
});

// Test read by id
crud.read(1, (err, item) => {
  if (err) {
    console.log("✗ read failed:", err.message);
  } else if (item.name === "Alice") {
    console.log("✓ read works");
  } else {
    console.log("✗ read wrong data");
  }
});

// Test non-existent id
crud.read(1000, (err, item) => {
  if (err) {
    console.log("✓ read error handling works");
  } else {
    console.log("✗ should have failed");
  }
});

// Cleanup
setTimeout(() => {
  fs.unlinkSync(testFile);
}, 100);
