/**
 * Async/Await Usage Example
 *
 * This example demonstrates the new Promise-based API
 * alongside the traditional callback-based methods
 */

import JsonFileCRUD from "../lib/json-file-crud.js";

const crud = new JsonFileCRUD("./examples/data/async-demo.json");

console.log("Async/Await API Demo\n");

async function asyncDemo() {
  try {
    // Clean start
    await crud.writeAllAsync([]);

    // Create items using async/await
    console.log("Creating users with async/await...");
    const user1 = await crud.createAsync({ name: "Ariel", age: 30 });
    console.log("Created:", user1);

    const user2 = await crud.createAsync({ name: "John", age: 25 });
    console.log("Created:", user2);

    // Read all users
    console.log("\nReading all users...");
    const allUsers = await crud.readAllAsync();
    console.log("All users:", allUsers);

    // Find by ID
    console.log("\nFinding user by ID...");
    const foundUser = await crud.findByIdAsync(user1.id);
    console.log("Found user:", foundUser);

    // Update user
    console.log("\nUpdating user...");
    const updatedUser = await crud.updateAsync(user1.id, { age: 31 });
    console.log("Updated user:", updatedUser);

    // Filter users
    console.log("\nFiltering users over 30...");
    const adults = await crud.findByAsync((user) => user.age > 30);
    console.log("Adults:", adults);

    // Count users
    console.log("\nCounting users...");
    const count = await crud.countAsync();
    console.log("Total users:", count);

    // Delete user
    console.log("\nDeleting user...");
    const deletedUser = await crud.deleteAsync(user2.id);
    console.log("Deleted user:", deletedUser);

    // Final count
    const finalCount = await crud.countAsync();
    console.log("Final count:", finalCount);

    console.log("\nAsync/Await demo completed successfully!");
  } catch (error) {
    console.error("Error in async demo:", error.message);
  }
}

// Run the async demo
asyncDemo();
