import JsonFileCRUD from "../lib/json-file-crud.js";
import fs from "fs";

// Test setup
const testFile = "./test-async-data.json";

function cleanup() {
  if (fs.existsSync(testFile)) {
    fs.unlinkSync(testFile);
  }
}

// Clean up and start fresh
cleanup();
const crud = new JsonFileCRUD(testFile);

// Run tests sequentially
async function runAllTests() {
  try {
    // Test 1: Create
    const item1 = await crud.createAsync({ name: "Test User" });
    console.log("✓ createAsync works");

    // Test 2: Create another
    const item2 = await crud.createAsync({ name: "User 2" });
    console.log("✓ createAsync works (second item)");

    // Test 3: Read all
    const allItems = await crud.readAllAsync();
    if (allItems.length === 2) {
      console.log("✓ readAllAsync works");
    } else {
      console.log("✗ readAllAsync failed");
    }

    // Test 4: Find by ID
    const foundItem = await crud.findByIdAsync(item1.id);
    if (foundItem && foundItem.name === "Test User") {
      console.log("✓ findByIdAsync works");
    } else {
      console.log("✗ findByIdAsync failed");
    }

    // Test 5: Find by filter
    const filteredItems = await crud.findByAsync((item) => item.name.includes("User"));
    if (filteredItems.length === 2) {
      console.log("✓ findByAsync works");
    } else {
      console.log("✗ findByAsync failed");
    }

    // Test 6: Count
    const count = await crud.countAsync();
    if (count === 2) {
      console.log("✓ countAsync works");
    } else {
      console.log("✗ countAsync failed");
    }

    // Test 7: Update
    const updated = await crud.updateAsync(item1.id, { age: 25 });
    if (updated.age === 25) {
      console.log("✓ updateAsync works");
    } else {
      console.log("✗ updateAsync failed");
    }

    // Test 8: Delete
    const deleted = await crud.deleteAsync(item2.id);
    if (deleted.name === "User 2") {
      console.log("✓ deleteAsync works");
    } else {
      console.log("✗ deleteAsync failed");
    }

    // Test 9: Delete all
    await crud.deleteAllAsync();
    const finalCount = await crud.countAsync();
    if (finalCount === 0) {
      console.log("✓ deleteAllAsync works");
    } else {
      console.log("✗ deleteAllAsync failed");
    }

    // Test 10: Error handling
    try {
      await crud.findByIdAsync(999);
      console.log("✗ error handling failed");
    } catch (error) {
      if (error.message.includes("not found")) {
        console.log("✓ error handling works");
      } else {
        console.log("✗ error handling failed");
      }
    }

    console.log("\nAll async tests completed");
  } catch (error) {
    console.error("Test error:", error.message);
  } finally {
    cleanup();
  }
}

runAllTests();
