BEGIN;

CREATE TABLE IF NOT EXISTS orders (
    order_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id),
    order_status VARCHAR(40) NOT NULL,
    subtotal_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(product_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0)
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    provider VARCHAR(80) NOT NULL,
    payment_status VARCHAR(40) NOT NULL,
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    authorized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (user_id, order_status, subtotal_cents, total_cents)
SELECT user_id, 'paid', 15498, 15498 FROM users WHERE email = 'ava@example.com'
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
SELECT o.order_id, p.product_id, 1, p.price_cents
FROM orders o
JOIN users u ON u.user_id = o.user_id
JOIN products p ON p.sku = 'SKU-100'
WHERE u.email = 'ava@example.com'
LIMIT 1;

INSERT INTO payments (order_id, provider, payment_status, amount_cents)
SELECT order_id, 'stripe', 'authorized', total_cents
FROM orders
ORDER BY order_id DESC
LIMIT 1;

COMMIT;
