import { products } from "../data/catalog.js";

// Returns a filtered list of products for browse and search screens.
export function listProducts(request, response) {
  const { category, search } = request.query;
  const normalizedSearch = String(search || "").trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatch = !category || product.category === category;
    const searchMatch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.tags.some((tag) => tag.includes(normalizedSearch));

    return categoryMatch && searchMatch;
  });

  response.json({
    products: filtered,
    total: filtered.length,
    filters: { category: category || null, search: normalizedSearch || null }
  });
}

// Returns a single product record to support product detail pages.
export function getProductBySku(request, response) {
  const product = products.find((entry) => entry.sku === request.params.sku);

  if (!product) {
    response.status(404).json({ error: "product_not_found", sku: request.params.sku });
    return;
  }

  response.json({ product });
}
