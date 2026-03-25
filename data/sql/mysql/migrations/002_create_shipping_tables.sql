CREATE TABLE IF NOT EXISTS shipments (
    shipment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    carrier_code VARCHAR(30) NOT NULL,
    tracking_number VARCHAR(80) NOT NULL,
    shipment_status VARCHAR(40) NOT NULL,
    shipped_at TIMESTAMP NULL
);

INSERT INTO shipments (order_id, carrier_code, tracking_number, shipment_status)
VALUES (1001, 'UPS', '1Z999AA10123456784', 'label_created');
