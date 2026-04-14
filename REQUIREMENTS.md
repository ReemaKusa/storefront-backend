# Storefront Backend Requirements Documentation

## Database Schema

### `users`
| Column | Type | Constraints |
|---|---|---|
| id | integer | primary key, serial |
| first_name | varchar(255) | not null |
| last_name | varchar(255) | not null |
| password_digest | varchar(255) | not null |

### `products`
| Column | Type | Constraints |
|---|---|---|
| id | integer | primary key, serial |
| name | varchar(255) | not null |
| price | decimal(10,2) | not null |
| category | varchar(255) | nullable |

### `orders`
| Column | Type | Constraints |
|---|---|---|
| id | integer | primary key, serial |
| user_id | integer | foreign key references users(id), not null |
| status | varchar(50) | not null, values: `active` or `complete` |
| created_at | timestamp | default now(), not null |

### `order_products`
| Column | Type | Constraints |
|---|---|---|
| id | integer | primary key, serial |
| order_id | integer | foreign key references orders(id), not null |
| product_id | integer | foreign key references products(id), not null |
| quantity | integer | not null |

## Entity Relationships
- One user can have many orders.
- One order can contain many products.
- One product can belong to many orders.
- `order_products` is the join table between `orders` and `products`.

## RESTful API Routes

### Users
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/users` | Create user and return JWT | No |
| POST | `/users/authenticate` | Authenticate user and return JWT | No |
| GET | `/users` | List all users | Yes |
| GET | `/users/:id` | Show a single user with 5 most recent purchases | Yes |

### Products
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/products` | List all products | No |
| GET | `/products/:id` | Show a single product | No |
| POST | `/products` | Create a product | Yes |
| GET | `/products/popular` | Show top 5 popular products | Yes |

### Orders
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/orders` | List all orders | Yes |
| GET | `/orders/:id` | Show one order | Yes |
| POST | `/orders` | Create order | Yes |
| POST | `/orders/:id/products` | Add a product to an active order | Yes |
| GET | `/users/:userId/orders/current` | Get current active order by user | Yes |
| GET | `/users/:userId/orders/completed` | Get completed orders by user | Yes |

## Expected JSON Shapes

### Create User Request
```json
{
  "first_name": "Rama",
  "last_name": "Saleh",
  "password": "password123"
}
```

### Create User Response
```json
{
  "user": {
    "id": 1,
    "first_name": "Rama",
    "last_name": "Saleh"
  },
  "token": "jwt-token"
}
```

### Create Product Request
```json
{
  "name": "Desk Lamp",
  "price": 34.5,
  "category": "Home"
}
```

### Create Order Request
```json
{
  "user_id": 1,
  "status": "active"
}
```

### Add Product To Order Request
```json
{
  "product_id": 1,
  "quantity": 2
}
```
