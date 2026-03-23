<div align="center">

# 🛒 Multi-Language E-Commerce Platform

**A production-grade, microservices-based e-commerce platform built with 7 programming languages, 11 domain services, full CI/CD pipelines, Kubernetes orchestration, and event-driven architecture.**

![GitHub repo size](https://img.shields.io/github/repo-size/ashish7802/ecommerce-platform?color=blue&style=flat-square)
![Languages](https://img.shields.io/badge/languages-7-brightgreen?style=flat-square)
![Microservices](https://img.shields.io/badge/microservices-11-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)
![Made with ❤️](https://img.shields.io/badge/made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square)

</div>

---

## ⚡ Tech Stack at a Glance

| Layer | Technologies |
|---|---|
| **Frontend** | React, TypeScript, React Native |
| **Backend** | Node.js, Python (FastAPI), Go, Java, Rust, C, C++ |
| **Databases** | PostgreSQL, MySQL, Redis, Elasticsearch |
| **Messaging** | Apache Kafka (Avro schemas) |
| **Infrastructure** | Docker, Kubernetes, Terraform |
| **CI/CD** | GitHub Actions |
| **Security** | HashiCorp Vault |
| **Observability** | Prometheus, Grafana Tempo, Fluent Bit |

---

## 🏗️ Architecture Overview

```
                    +---------------------------+
                    |        Frontends          |
                    |  Web App | Mobile | Admin |
                    +------------+--------------+
                                 |
                                 ▼
                    +---------------------------+
                    |   API Gateway / BFFs      |
                    +------------+--------------+
                                 |
          +----------------------+---------------------+
          |                      |                     |
          ▼                      ▼                     ▼
 +----------------+   +--------------------+   +--------------+
 | Auth & Identity|   | Commerce Services  |   | Experience   |
 | JS / Node.js   |   | Cart (Go)          |   | Search (Go)  |
 +----------------+   | Catalog (Python)   |   | Reco (Python)|
                      | Order (Java)       |   | Reviews (JS) |
                      | Payment (Rust)     |   +--------------+
                      | Pricing (C)        |
                      | Inventory (C++)    |
                      | Shipping (Java)    |
                      | Notification (Py)  |
                      +----------+---------+
                                 |
                 +---------------+---------------+
                 |                               |
                 ▼                               ▼
       +------------------+           +------------------+
       | Datastores       |           | Message Bus      |
       | PostgreSQL       |           | Kafka Topics     |
       | MySQL            |           | order-events     |
       | Redis            |           | catalog-events   |
       | Elasticsearch    |           +------------------+
       +------------------+
```

---

## 📦 Project Structure

```
.
├── backend/          # API Gateway + BFF layers (Node.js)
├── frontend/         # Web App, Mobile App, Admin Portal (React/RN)
├── services/         # 11 domain microservices (7 languages)
├── data/             # SQL schemas, Redis config, Elasticsearch indexes
├── core-systems/     # Messaging, observability, service discovery
├── platform/         # Docker, Kubernetes, Terraform
├── sdk/              # Client SDKs (JS, Python, Go, Java, Rust)
├── ci-cd/            # Reusable pipeline templates
├── security/         # Vault policies, security docs
├── scripts/          # Bootstrap, DB, deployment scripts
├── tests/            # Unit, integration, contract, E2E, performance
└── docs/             # Architecture, API, runbooks, security docs
```

---

## 🚀 Microservices Breakdown

| Service | Language | Responsibility |
|---|---|---|
| **Identity Service** | Node.js | Auth, sessions, user management |
| **Catalog Service** | Python (FastAPI) | Products, categories |
| **Search Service** | Go | Keyword search, Elasticsearch indexing |
| **Recommendation Service** | Python (ML) | Personalized product suggestions |
| **Cart Service** | Go | Cart state, promotions |
| **Pricing Service** | C | Discounts, totals calculation |
| **Inventory Service** | C++ | Stock ledger, reservations |
| **Payment Service** | Rust | Stripe integration, charge processing |
| **Order Service** | Java | Order lifecycle management |
| **Shipping Service** | Java | Shipment scheduling, fulfillment |
| **Notification Service** | Python | Email & SMS notifications |

---

## 🔄 Key Flows

### 🛍️ Customer Checkout Flow
```
Customer → Frontend → API Gateway
  → Cart Service      (validate cart)
  → Pricing Service   (calculate totals & discounts)
  → Inventory Service (confirm stock availability)
  → Payment Service   (authorize payment via Stripe)
  → Order Service     (create order record)
  → Shipping Service  (plan delivery)
  → Notification Service (send confirmation email/SMS)
```

### ⚡ Event-Driven Order Flow
```
Order Service
  → publishes "order-created" to Kafka
      ├── Inventory Service    (adjust reserved stock)
      ├── Shipping Service     (start fulfillment workflow)
      └── Notification Service (send email & SMS)
```

### 🔍 Product Browse Flow
```
Customer → Web App → API Gateway
  → Catalog Service        (fetch product data)
  → Search Service         (keyword lookup)
  → Recommendation Service (personalized suggestions)
  → Response rendered on frontend
```

---

## 🛠️ Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Go 1.22+
- Python 3.11+
- Java 21+

### Local Setup

```bash
# Clone the repo
git clone https://github.com/ashish7802/ecommerce-platform.git
cd ecommerce-platform

# Bootstrap local environment
./scripts/bootstrap/bootstrap-dev.sh

# Start all services
docker compose -f platform/docker/environments/local/compose.yaml up

# Run database migrations
./scripts/database/run-migrations.sh

# Seed reference data
./scripts/database/seed-reference-data.sh
```

---

## 🧪 Testing

```bash
# Unit tests
make test-unit

# Integration tests
make test-integration

# Contract tests
make test-contract

# E2E tests (Playwright)
make test-e2e

# Performance tests (k6)
make test-performance
```

---

## 📊 Observability Stack

| Tool | Purpose |
|---|---|
| **Prometheus** | Metrics collection & alerting |
| **Grafana Tempo** | Distributed tracing across services |
| **Fluent Bit** | Centralized log aggregation |

---

## 🔒 Security

- **HashiCorp Vault** — secrets management & rotation
- **JWT-based authentication** — via Identity Service
- **Rate limiting** — enforced at API Gateway level
- **Dependency & vulnerability scanning** — automated in CI pipeline
- **Access control matrix** — role-based service permissions

---

## 📚 Client SDKs

Client libraries available for external integrations:

| Language | Location |
|---|---|
| JavaScript | `sdk/javascript/` |
| Python | `sdk/python/` |
| Go | `sdk/go/` |
| Java | `sdk/java/` |
| Rust | `sdk/rust/` |

---

## 📁 Documentation

- [System Architecture](docs/architecture/system-context.md)
- [Service Dependency Matrix](docs/architecture/service-dependency-matrix.md)
- [Public API Reference](docs/api/public-api-overview.md)
- [Security Threat Model](docs/security/threat-model.md)
- [Runbooks](docs/runbooks/)

---

## 👨‍💻 Author

<div align="center">

**Ashish Yadav** — Full Stack Developer & AI Builder

[![Portfolio](https://img.shields.io/badge/Portfolio-ashyadav.netlify.app-blue?style=flat-square)](https://ashyadav.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/ashish-yadav-ab206124a)
[![GitHub](https://img.shields.io/badge/GitHub-ashish7802-181717?style=flat-square&logo=github)](https://github.com/ashish7802)

</div>

---

## 📜 License

MIT License — free to use as reference or learning material.

---

<div align="center">

⭐ **If this project helped you understand microservices architecture, drop a star!** ⭐

</div>
