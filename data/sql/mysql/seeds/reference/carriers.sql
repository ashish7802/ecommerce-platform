CREATE TABLE IF NOT EXISTS carriers (
    carrier_code VARCHAR(30) PRIMARY KEY,
    carrier_name VARCHAR(100) NOT NULL
);

INSERT INTO carriers (carrier_code, carrier_name)
VALUES ('UPS', 'United Parcel Service'),
       ('DHL', 'DHL Express'),
       ('FEDEX', 'FedEx')
ON DUPLICATE KEY UPDATE carrier_name = VALUES(carrier_name);
