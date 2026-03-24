import assert from "node:assert/strict";
import test from "node:test";

import { startServer } from "../../src/server.js";

let server;
let baseUrl;

test.before(async () => {
  server = await startServer(0);
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test("health endpoint returns gateway metadata", async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.service, "api-gateway");
  assert.ok(payload.requestId.startsWith("req-"));
});

test("products endpoint returns sample catalog data", async () => {
  const response = await fetch(`${baseUrl}/api/products?category=footwear`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.total, 1);
  assert.equal(payload.products[0].sku, "SKU-100");
});

test("product details endpoint returns an individual product", async () => {
  const response = await fetch(`${baseUrl}/api/products/SKU-210`);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.product.name, "Performance Hoodie");
});

test("order quote endpoint calculates totals from sample data", async () => {
  const response = await fetch(`${baseUrl}/api/orders/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-id": "cust-42" },
    body: JSON.stringify({
      items: [
        { sku: "SKU-100", quantity: 1 },
        { sku: "SKU-210", quantity: 1 }
      ]
    })
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.customerId, "cust-42");
  assert.equal(payload.discountCents, 2000);
  assert.equal(payload.taxCents, 1485);
  assert.equal(payload.totalCents, 19483);
});

test("order creation endpoint persists an in-memory order", async () => {
  const createResponse = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-id": "cust-50" },
    body: JSON.stringify({ items: [{ sku: "SKU-305", quantity: 2 }] })
  });

  assert.equal(createResponse.status, 201);
  const created = await createResponse.json();
  assert.equal(created.order.status, "pending_payment");

  const listResponse = await fetch(`${baseUrl}/api/orders?customerId=cust-50`);
  const listed = await listResponse.json();
  assert.equal(listed.total, 1);
  assert.equal(listed.orders[0].orderId, created.order.orderId);
});

test("order quote rejects empty carts", async () => {
  const response = await fetch(`${baseUrl}/api/orders/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-id": "cust-42" },
    body: JSON.stringify({ items: [] })
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, "items_required");
});

test("payment route validates bad inputs", async () => {
  const response = await fetch(`${baseUrl}/api/payments/authorize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amountCents: 99, currency: "EUR", cardToken: "bad" })
  });

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, "invalid_amount");
});
