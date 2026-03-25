BEGIN;

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    inventory_count INTEGER NOT NULL CHECK (inventory_count >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, full_name)
VALUES
    ('ava@example.com', 'Ava Carter'),
    ('liam@example.com', 'Liam Brooks')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (sku, name, category, description, price_cents, inventory_count)
VALUES
    ('SKU-100', 'Trail Running Shoes', 'footwear', 'High-grip running shoes for mixed terrain.', 12999, 12),
    ('SKU-210', 'Performance Hoodie', 'apparel', 'Breathable hoodie built for training sessions.', 6999, 24),
    ('SKU-305', 'Insulated Water Bottle', 'accessories', 'Vacuum-insulated bottle for all-day hydration.', 2499, 40)
ON CONFLICT (sku) DO NOTHING;

COMMIT;
