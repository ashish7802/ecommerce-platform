CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    provider VARCHAR(80) NOT NULL,
    payment_status VARCHAR(40) NOT NULL,
    amount_cents INT NOT NULL,
    authorized_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO payments (order_id, provider, payment_status, amount_cents)
VALUES (1001, 'stripe', 'authorized', 15498),
       (1002, 'paypal', 'captured', 6999);

SELECT provider, payment_status, amount_cents
FROM payments
ORDER BY authorized_at DESC;
