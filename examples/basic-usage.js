/**
 * Basic Usage Example
 *
 * This example demonstrates the basic CRUD operations:
 * - Create: Adding new items
 * - Read: Finding and reading items
 * - Update: Modifying existing items
 * - Delete: Removing items
 */

import JsonFileCRUD from "../lib/json-file-crud.js";

// Initialize the CRUD instance
const crud = new JsonFileCRUD("./examples/data/users.json");

console.log("Basic CRUD Operations\n");

// Step 1: Create some users
console.log("Creating users...");
crud.create({ name: "Ariel", age: 30, city: "Tel Aviv" }, (err, user) => {
  if (err) {
    console.error("Error creating user:", err.message);
    return;
  }

  console.log("Created user:", user);

  // Step 2: Create another user
  crud.create({ name: "Yoni", age: 25, city: "Jerusalem" }, (err, user2) => {
    if (err) {
      console.error("Error creating user:", err.message);
      return;
    }

    console.log("Created user:", user2);

    // Step 3: Read all users
    console.log("\nReading all users...");
    crud.readAll((err, users) => {
      if (err) {
        console.error("Error reading users:", err.message);
        return;
      }

      console.log("All users:", users);

      // Step 4: Find specific user
      console.log("\nFinding user by ID...");
      crud.findById(user.id, (err, foundUser) => {
        if (err) {
          console.error("Error finding user:", err.message);
          return;
        }

        console.log("Found user:", foundUser);

        // Step 5: Update user
        console.log("\nUpdating user...");
        crud.update(user.id, { age: 31, city: "Haifa" }, (err, updatedUser) => {
          if (err) {
            console.error("Error updating user:", err.message);
            return;
          }

          console.log("Updated user:", updatedUser);

          // Step 6: Delete user
          console.log("\nDeleting user...");
          crud.delete(user2.id, (err, deletedUser) => {
            if (err) {
              console.error("Error deleting user:", err.message);
              return;
            }

            console.log("Deleted user:", deletedUser);

            // Step 7: Final count
            console.log("\nFinal count...");
            crud.count((err, count) => {
              if (err) {
                console.error("Error counting users:", err.message);
                return;
              }

              console.log(`Total users: ${count}`);
              console.log("\nBasic CRUD operations completed!");
            });
          });
        });
      });
    });
  });
});
