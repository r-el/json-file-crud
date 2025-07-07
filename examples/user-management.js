/**
 * User Management Example
 *
 * This example shows how to build a simple user management system:
 * - User registration
 * - User authentication (basic)
 * - Profile management
 * - User roles and permissions
 */

import JsonFileCRUD from "../lib/json-file-crud.js";

const usersCrud = new JsonFileCRUD("./examples/data/users-system.json");

console.log("User Management System\n");

// User Management Class
class UserManager {
  constructor(crud) {
    this.crud = crud;
  }

  // Register new user
  registerUser(userData, callback) {
    console.log(`Registering user: ${userData.username}`);

    // Check if username already exists
    this.crud.findBy(
      (user) => user.username === userData.username,
      (err, existingUsers) => {
        if (err) return callback(err);

        if (existingUsers.length > 0) {
          return callback(new Error("Username already exists"));
        }

        // Create new user with default values
        const newUser = {
          ...userData,
          createdAt: new Date().toISOString(),
          role: userData.role || "user",
          isActive: true,
        };

        this.crud.create(newUser, callback);
      }
    );
  }

  // Find user by username
  findByUsername(username, callback) {
    this.crud.findBy(
      (user) => user.username === username,
      (err, users) => {
        if (err) return callback(err);
        callback(null, users[0] || null);
      }
    );
  }

  // Update user profile
  updateProfile(userId, profileData, callback) {
    console.log(`Updating profile for user ID: ${userId}`);

    // Remove sensitive fields that shouldn't be updated
    const { id, username, createdAt, ...updateData } = profileData;

    this.crud.update(
      userId,
      {
        ...updateData,
        updatedAt: new Date().toISOString(),
      },
      callback
    );
  }

  // Deactivate user (soft delete)
  deactivateUser(userId, callback) {
    console.log(`Deactivating user ID: ${userId}`);

    this.crud.update(
      userId,
      {
        isActive: false,
        deactivatedAt: new Date().toISOString(),
      },
      callback
    );
  }

  // Get active users
  getActiveUsers(callback) {
    this.crud.findBy((user) => user.isActive === true, callback);
  }

  // Get users by role
  getUsersByRole(role, callback) {
    this.crud.findBy((user) => user.role === role && user.isActive === true, callback);
  }
}

// Demo usage
const userManager = new UserManager(usersCrud);

// Register some users
const users = [
  { username: "admin", email: "admin@example.com", name: "Admin User", role: "admin" },
  { username: "ariel", email: "ariel@example.com", name: "Ariel Cohen", role: "user" },
  { username: "yoni", email: "yoni@example.com", name: "Yoni Levy", role: "user" },
  { username: "manager", email: "manager@example.com", name: "Manager User", role: "manager" },
];

let registeredCount = 0;
const registeredUsers = [];

users.forEach((userData) => {
  userManager.registerUser(userData, (err, user) => {
    if (err) {
      console.error(`Error registering ${userData.username}:`, err.message);
    } else {
      console.log(`Registered: ${user.username} (${user.role})`);
      registeredUsers.push(user);
    }

    registeredCount++;

    if (registeredCount === users.length) {
      continueDemoOperations();
    }
  });
});

function continueDemoOperations() {
  console.log("\nFinding user by username...");

  userManager.findByUsername("ariel", (err, user) => {
    if (err) {
      console.error("Error finding user:", err.message);
      return;
    }

    if (user) {
      console.log("Found user:", user);

      // Update profile
      console.log("\nUpdating user profile...");
      userManager.updateProfile(
        user.id,
        {
          name: "Ariel Cohen-Levi",
          bio: "Software Developer",
          age: 30,
        },
        (err, updatedUser) => {
          if (err) {
            console.error("Error updating profile:", err.message);
            return;
          }

          console.log("Profile updated:", updatedUser);

          // Get users by role
          console.log("\nGetting admin users...");
          userManager.getUsersByRole("admin", (err, adminUsers) => {
            if (err) {
              console.error("Error getting admin users:", err.message);
              return;
            }

            console.log("Admin users:", adminUsers.length);

            // Get all active users
            console.log("\nGetting all active users...");
            userManager.getActiveUsers((err, activeUsers) => {
              if (err) {
                console.error("Error getting active users:", err.message);
                return;
              }

              console.log("Active users:", activeUsers.length);

              // Show final summary
              console.log("\nUser Management Summary:");
              console.log(`- Total registered users: ${registeredUsers.length}`);
              console.log(`- Active users: ${activeUsers.length}`);
              console.log(`- Admin users: ${adminUsers.length}`);

              const usersByRole = activeUsers.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
              }, {});

              console.log("- Users by role:", usersByRole);
              console.log("\nUser Management completed!");
            });
          });
        }
      );
    } else {
      console.log("User not found");
    }
  });
}
