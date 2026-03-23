import { orders, products } from "../data/catalog.js";
import { HttpError } from "../lib/httpError.js";

function resolveLineItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, "items_required");
  }

  return items.map((item) => {
    const product = products.find((entry) => entry.sku === item.sku);
    if (!product) {
      throw new HttpError(404, "product_not_found", { sku: item.sku });
    }

    const quantity = Number(item.quantity || 0);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new HttpError(400, "invalid_quantity", { sku: item.sku, quantity });
    }
    if (quantity > product.inventory) {
      throw new HttpError(409, "insufficient_inventory", { sku: item.sku, requested: quantity, inventory: product.inventory });
    }

    return {
      sku: product.sku,
      name: product.name,
      quantity,
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * quantity
    };
  });
}

function buildTotals(lineItems) {
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const tenPercentDiscount = subtotalCents >= 15_000 ? Math.round(subtotalCents * 0.1) : 0;
  const bulkDiscount = itemCount >= 4 ? 500 : 0;
  const discountCents = tenPercentDiscount + bulkDiscount;
  const discountedSubtotal = Math.max(0, subtotalCents - discountCents);
  const shippingCents = discountedSubtotal > 10_000 ? 0 : 899;
  const taxCents = Math.round(discountedSubtotal * 0.0825);

  return {
    subtotalCents,
    discountCents,
    shippingCents,
    taxCents,
    totalCents: discountedSubtotal + shippingCents + taxCents
  };
}

// Quotes an order before checkout is confirmed.
export function quoteOrder(request, response, next) {
  try {
    const lineItems = resolveLineItems(request.body.items);
    const totals = buildTotals(lineItems);

    response.json({
      customerId: request.context.identity.userId,
      items: lineItems,
      itemCount: lineItems.reduce((sum, item) => sum + item.quantity, 0),
      ...totals
    });
  } catch (error) {
    next(error);
  }
}

// Creates an in-memory order record to simulate a real checkout flow.
export function createOrder(request, response, next) {
  try {
    const lineItems = resolveLineItems(request.body.items);
    const totals = buildTotals(lineItems);
    const order = {
      orderId: `ord_${orders.length + 1}`,
      customerId: request.context.identity.userId,
      status: "pending_payment",
      items: lineItems,
      ...totals
    };

    orders.push(order);
    response.status(201).json({ order });
  } catch (error) {
    next(error);
  }
}

// Lists orders stored during the current process lifetime.
export function listOrders(request, response) {
  const customerId = request.query.customerId;
  const result = customerId ? orders.filter((order) => order.customerId === customerId) : [...orders];
  response.json({ orders: result, total: result.length });
}
