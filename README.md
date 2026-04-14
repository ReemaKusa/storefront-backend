# Storefront Backend API

Complete backend project for a shopping application built with:
- Node.js
- Express
- TypeScript
- PostgreSQL
- db-migrate
- JWT authentication
- bcrypt password hashing
- Jasmine + SuperTest

## Ports
- Backend API: `3000`
- PostgreSQL: `5432`

## Environment Variables
Create a `.env` file in the project root using the following values:

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
ENV=dev
BCRYPT_PASSWORD=super-secret-pepper
SALT_ROUNDS=10
TOKEN_SECRET=super-secret-token
PORT=3000
```

> Note for reviewer: the project requires these variables. They are also included in `.env.example` for convenience.

## Package Installation
```bash
npm install
```

or

```bash
yarn
```

## Database Setup
### Option 1: Docker
Run PostgreSQL with Docker:

```bash
docker-compose up -d
```

Then create the test database:

```bash
docker exec -it storefront_db psql -U postgres -c "CREATE DATABASE storefront_test;"
```

### Option 2: Local PostgreSQL
Create two databases manually:
- `storefront`
- `storefront_test`

Example:

```sql
CREATE DATABASE storefront;
CREATE DATABASE storefront_test;
```

## Run Migrations
```bash
npm run migrate:up
```

## Start the Server
```bash
npm run watch
```

The server will run at:

```text
http://localhost:3000
```

## Build
```bash
npm run build
```

## Run Tests
On Windows CMD:

```bash
npm run test:win
```

On macOS/Linux:

```bash
NODE_ENV=test db-migrate up --env test && jasmine && db-migrate reset --env test
```

## Project Structure
```text
src/
  app.ts
  server.ts
  config.ts
  database.ts
  handlers/
  helpers/
  middleware/
  models/
  tests/
migrations/
spec/support/
```

## Authentication
Protected routes require a JWT in the header:

```http
Authorization: Bearer <token>
```

## Main Features
- User registration and authentication
- Product creation and browsing
- Order creation and retrieval
- Add products to an order
- Current order by user
- Completed orders by user
- User endpoint returns 5 most recent purchases
- Popular products endpoint returns top 5 ordered products
