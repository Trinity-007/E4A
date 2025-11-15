# E4A Backend - Production API Server

Production-ready Express.js backend for the E4A affordable resale marketplace. Includes:
- RESTful API for products, users, orders
- MongoDB database integration
- bcrypt password hashing + JWT authentication
- Image upload with Multer
- CORS enabled for frontend integration

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+ (local or MongoDB Atlas)

### Installation

```bash
cd backend
npm install
```

### Configuration

Create `.env` file in `backend/` folder:

```
MONGODB_URI=mongodb://localhost:27017/e4a_db
JWT_SECRET=your_super_secret_key_change_in_production
PORT=3000
```

### Run

**Development (auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?q=search_term` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create new order

### Images
- `POST /api/upload` - Upload product image (multipart form-data)

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Search Products
```bash
curl http://localhost:3000/api/products?q=phone
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"id": 1, "name": "Product", "price": 99}
    ],
    "total": 99,
    "contact": {
      "name": "Customer Name",
      "email": "customer@example.com"
    }
  }'
```

### Upload Image
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "image=@/path/to/image.jpg"
```

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  id: Number,
  name: String,
  price: Number,
  category: String,
  image: String (file path),
  description: String,
  createdAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  id: String,
  items: Array,
  total: Number,
  contact: {
    name: String,
    email: String
  },
  createdAt: Date
}
```

## Deployment

### Docker (Local)

```bash
docker-compose up --build
```

This starts:
- MongoDB on port 27017
- Backend on port 3000
- Serves Frontend from `../Frontend`

### Render.com

1. Push code to GitHub
2. Create Web Service on render.com
3. Set environment variables
4. Deploy!

See `../DEPLOYMENT.md` for detailed steps.

### MongoDB Setup

**Local MongoDB:**
```bash
mongod --dbpath "C:\data\db"
```

**MongoDB Atlas (Cloud):**
1. Create free account at https://mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `MONGODB_URI` in .env

## Security Notes

⚠️ **For Production:**
- Use strong `JWT_SECRET` (min 32 characters)
- Enable HTTPS/SSL
- Restrict CORS to specific domains
- Use environment variables for secrets
- Enable rate limiting
- Sanitize user inputs
- Use MongoDB Atlas instead of local DB
- Enable database backups
- Keep dependencies updated

## Development

### Project Structure

```
backend/
├── src/
│   ├── server.js          # Entry point
│   ├── models/            # Mongoose models
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/            # API routes
│       ├── auth.js
│       ├── products.js
│       ├── orders.js
│       └── upload.js
├── data/
│   └── products.json      # Initial product data
├── package.json
├── .env                   # Configuration
├── Dockerfile
└── docker-compose.yml
```

### Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ORM
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `multer` - File uploads
- `cors` - CORS support
- `dotenv` - Environment variables
- `nodemon` - Auto-restart (dev)

## Troubleshooting

**MongoDB connection error:**
```
Error: connect ECONNREFUSED
```
→ Make sure MongoDB is running: `mongod --dbpath "C:\data\db"`

**JWT errors:**
```
JsonWebTokenError: invalid token
```
→ Ensure JWT_SECRET matches between signup and login

**Port already in use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
→ Kill existing process or change PORT in .env

**Products not seeding:**
- Check `data/products.json` exists and is valid JSON
- Check file permissions
- Check MongoDB connection

## Support

Check logs in terminal where `npm start` is running for detailed error messages.

Use browser DevTools Network tab to inspect API responses.

---

**Version**: 1.0.0
**Last Updated**: Nov 15, 2025

