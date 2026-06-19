# Plant Shop

> A full-stack e-commerce platform for plant sales, featuring a storefront, commerce backend, and infrastructure configuration.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

---

## Overview

Plant Shop is a complete e-commerce solution built with TypeScript. It consists of a customer-facing storefront, a commerce backend handling products and orders, and infrastructure configuration for deployment. The project demonstrates a modern full-stack architecture with a clear separation between presentation, business logic, and infrastructure.

## Features

- Product catalog with browsing and filtering
- Shopping cart and checkout flow
- Commerce backend managing inventory and orders
- Modular infrastructure setup for deployment

## Project Structure

```
plant-shop/
├── frontend/
│   └── plant-storefront/     # Customer-facing storefront UI
├── commerce/
│   └── plant-shop/           # Commerce backend (products, orders, inventory)
├── infra/                    # Infrastructure and deployment configuration
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | TypeScript, CSS |
| Backend/Commerce | TypeScript |
| Infrastructure | Configuration files in `/infra` |

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/HamzaDalhoumi/plant-shop.git
cd plant-shop
```

### Run the Storefront

```bash
cd frontend/plant-storefront
npm install
npm run dev
```

### Run the Commerce Backend

```bash
cd commerce/plant-shop
npm install
npm start
```

---

*Built by [Hamza Dalhoumi](https://github.com/HamzaDalhoumi)*
