// Sample catalog data kept in memory so the backend can run without a database.
export const products = [
  {
    sku: "SKU-100",
    name: "Trail Running Shoes",
    category: "footwear",
    brand: "North Summit",
    priceCents: 12999,
    currency: "USD",
    inventory: 12,
    tags: ["trail", "running", "grip"]
  },
  {
    sku: "SKU-210",
    name: "Performance Hoodie",
    category: "apparel",
    brand: "Peakline",
    priceCents: 6999,
    currency: "USD",
    inventory: 24,
    tags: ["training", "warm", "breathable"]
  },
  {
    sku: "SKU-305",
    name: "Insulated Water Bottle",
    category: "accessories",
    brand: "North Summit",
    priceCents: 2499,
    currency: "USD",
    inventory: 40,
    tags: ["hydration", "outdoors", "travel"]
  }
];

export const orders = [];
