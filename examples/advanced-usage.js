/**
 * Advanced Usage Example
 *
 * This example demonstrates advanced features:
 * - Concurrent operations (queue handling)
 * - Auto-ID assignment
 * - Custom ID fields
 * - Filtering and searching
 * - Error handling patterns
 */

import JsonFileCRUD from "../lib/json-file-crud.js";

// Initialize with custom ID field
const productsCrud = new JsonFileCRUD("./examples/data/products.json", {
  idField: "productId",
});

console.log("Advanced Features\n");

// Concurrent operations
console.log("Testing concurrent operations...");

// Create multiple items simultaneously (they will be queued)
const products = [
  { name: "Laptop", price: 3000, category: "Electronics" },
  { name: "Mouse", price: 50, category: "Electronics" },
  { name: "Keyboard", price: 150, category: "Electronics" },
  { name: "Monitor", price: 800, category: "Electronics" },
];

let completed = 0;
const createdProducts = [];

products.forEach((product, index) => {
  productsCrud.create(product, (err, result) => {
    if (err) {
      console.error(`Error creating product ${index}:`, err.message);
      return;
    }

    createdProducts.push(result);
    completed++;

    console.log(`Created product ${completed}/${products.length}:`, result);

    // When all products are created, continue
    if (completed === products.length) {
      continueWithAdvancedFeatures();
    }
  });
});

function continueWithAdvancedFeatures() {
  console.log("\nAdvanced search and filtering...");

  // Find products by category
  productsCrud.findBy(
    (product) => product.category === "Electronics",
    (err, electronics) => {
      if (err) {
        console.error("Error finding electronics:", err.message);
        return;
      }

      console.log("Electronics found:", electronics.length);

      // Find expensive products
      productsCrud.findBy(
        (product) => product.price > 100,
        (err, expensiveProducts) => {
          if (err) {
            console.error("Error finding expensive products:", err.message);
            return;
          }

          console.log("Expensive products (>100):", expensiveProducts.length);

          // Batch update
          console.log("\nApplying 10% discount to all products...");

          let updateCount = 0;
          createdProducts.forEach((product) => {
            const discountedPrice = Math.round(product.price * 0.9);

            productsCrud.update(
              product.productId,
              {
                price: discountedPrice,
                onSale: true,
              },
              (err, updatedProduct) => {
                if (err) {
                  console.error("Error updating product:", err.message);
                  return;
                }

                updateCount++;
                console.log(
                  `Updated product ${updateCount}/${createdProducts.length}: ${updatedProduct.name} - ${updatedProduct.price} NIS`
                );

                if (updateCount === createdProducts.length) {
                  finalSummary();
                }
              }
            );
          });
        }
      );
    }
  );
}

function finalSummary() {
  console.log("\nFinal Summary...");

  productsCrud.readAll((err, allProducts) => {
    if (err) {
      console.error("Error reading all products:", err.message);
      return;
    }

    const totalValue = allProducts.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = Math.round(totalValue / allProducts.length);

    console.log(`Total products: ${allProducts.length}`);
    console.log(`Total value: ${totalValue} NIS`);
    console.log(`Average price: ${averagePrice} NIS`);
    console.log(`All products on sale: ${allProducts.every((p) => p.onSale)}`);

    console.log("\nAdvanced features completed!");
  });
}
