# Mini Lead Distribution System

Full Stack Developer Assignment implementation.

## Tech Stack

- Next.js 15
- TypeScript
- MongoDB Atlas
- Mongoose
- Tailwind CSS
- Zod

---

## Features

- Public customer service request form
- Duplicate lead prevention (DB enforced)
- Mandatory provider assignment rules
- Fair round-robin provider allocation
- Monthly quota enforcement
- Real-time dashboard auto updates (polling)
- Webhook quota reset
- Webhook idempotency
- Concurrent lead generation testing
- Provider dashboard

---

## Setup

Install dependencies:

```bash
npm install
```

Create:

```env
.env.local
```

Add:

```env
MONGODB_URI=your_mongodb_connection_string
```

Run:

```bash
npm run dev
```

Seed database:

```bash
npm run seed
```

---

## Routes

### Public Form
/request-service

### Provider Dashboard
/dashboard

### Test Tools
/test-tools

---

## Allocation Algorithm

Each lead is assigned to exactly 3 providers.

Rules:

Service 1:
- Mandatory: Provider 1
- Fair Pool: Provider 2,3,4

Service 2:
- Mandatory: Provider 5
- Fair Pool: Provider 6,7,8

Service 3:
- Mandatory: Provider 1,4
- Fair Pool: Provider 2,3,5,6,7,8

Round-robin state is persisted in MongoDB.

This ensures:
- fair rotation
- no repeated favoritism
- persistence across restarts

---

## Concurrency Handling

Lead allocation uses:
- MongoDB transactions
- atomic findOneAndUpdate quota reservation
- unique DB constraints
- transaction-safe provider allocation

This prevents:
- over-allocation
- duplicate provider assignment
- race conditions

---

## Webhook Idempotency

Webhook events use unique event keys.

Repeated webhook calls with same event key:
- ignored safely
- no duplicate quota reset

---

## Duplicate Prevention

Database-level unique constraint:

(phone + serviceId)

This prevents duplicate leads for same service.

---

## Live Demo

Add deployed URL here.