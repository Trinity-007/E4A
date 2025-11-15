# E4A - Affordable Resale Marketplace

A full-stack e-commerce platform built with Node.js, Express, MongoDB, and vanilla JavaScript. Designed for low-price resale of quality items.

## Features

✅ **Product Catalog** - 80+ products across 13 categories (Phones, Computers, Furniture, Kitchen, Tools, Vehicles, etc.)
✅ **Search & Filter** - Real-time search and category filtering
✅ **User Authentication** - Signup/login with bcrypt + JWT tokens
✅ **Shopping Cart** - Add/remove items, persistent cart
✅ **Checkout** - Order creation with customer details, orders stored in MongoDB
✅ **Admin Panel** - Dashboard, product management, image uploads, order tracking
✅ **Image Upload** - Upload product images directly to backend
✅ **MongoDB** - Persistent database for products, users, orders
✅ **Fully Responsive** - Mobile-friendly design

## Tech Stack

- **Frontend**: HTML, CSS, vanilla JavaScript (no frameworks)
- **Backend**: Node.js + Express
- **Database**: MongoDB (local or Atlas)
- **Auth**: bcrypt (password hashing) + JWT (tokens)
- **File Upload**: Multer
- **Hosting**: Render, Railway, or Docker

## Local Setup

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- MongoDB 5.0+ (https://mongodb.com/try/download)

### Installation

1. **Start MongoDB**
   ```bash
   # Windows
   mongod --dbpath "C:\data\db"
   
   # macOS/Linux
   mongod --dbpath ~/mongodb_data
   ```

2. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev   # or: node src/server.js
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

The backend serves both the API and the frontend files from `Frontend/` folder.

## Usage

### For Customers

1. **Browse Products**: Home page shows featured items
2. **Search**: Use search bar to find products (e.g., "refrigerator", "bicycle")
3. **Filter**: Click category buttons to filter by category
4. **Add to Cart**: Click "Add" button on any product
5. **Checkout**: Go to cart, enter details, place order
6. **View Order**: Order saved to MongoDB with confirmation

### For Admins

**Access Admin Panel:**
```
http://localhost:3000/admin.html
Password: admin123
```

**Features:**
- **Dashboard**: View total products, orders, revenue
- **Upload Images**: Add new products with images
- **Manage Products**: List, view, delete products
- **View Orders**: Track all customer orders

## Project Structure

```
E4A_full_website/
├── Frontend/              # Frontend files (served by backend)
│   ├── index.html         # Home page
│   ├── shop.html          # Shop/products page
│   ├── product.html       # Product detail page
│   ├── cart.html          # Shopping cart
│   ├── signin.html        # Login page
│   ├── signup.html        # Registration page
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── admin.html         # Admin panel
│   ├── script.js          # Main app logic (API integration)
│   ├── style.css          # Styling
│   └── images/            # Product images (uploaded here)
│
├── backend/               # Backend server
│   ├── src/
│   │   ├── server.js      # Express server entry
│   │   ├── models/        # MongoDB models (User, Product, Order)
│   │   └── routes/        # API routes (auth, products, orders, upload)
│   ├── data/
│   │   └── products.json  # Initial product data
│   ├── package.json       # Dependencies
│   ├── Dockerfile         # Docker image
│   └── docker-compose.yml # Local MongoDB + backend
│
├── DEPLOYMENT.md          # Deployment guide
├── render.yaml            # Render.com config
└── railway.json           # Railway.app config
```

## API Endpoints

### Public Endpoints

```
GET    /api/products           # Get all products
GET    /api/products?q=search  # Search products
GET    /api/products/:id       # Get single product
POST   /api/auth/register      # Register user
POST   /api/auth/login         # Login user
POST   /api/orders             # Create order
GET    /api/orders             # List orders
POST   /api/upload             # Upload image (form-data)
```

## Environment Variables

Create `.env` in `backend/` folder:

```
MONGODB_URI=mongodb://localhost:27017/e4a_db
JWT_SECRET=your_secret_key_minimum_32_characters
PORT=3000
```

## Deployment

### Quick Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables:
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random string
6. Deploy!

See `DEPLOYMENT.md` for detailed instructions for Render, Railway, Docker, etc.

## Default Credentials

**Admin Panel:**
- Password: `admin123`

**Test Account (create via signup):**
- Email: test@example.com
- Password: password123

## Features Implemented

### Phase 1 (Completed) ✅
- [x] Product catalog with 80 items
- [x] Search and category filtering
- [x] Shopping cart
- [x] User auth (signup/login)
- [x] Checkout and orders
- [x] MongoDB integration
- [x] Backend API
- [x] Frontend served by backend

### Phase 2 (Completed) ✅
- [x] Admin panel
- [x] Image upload
- [x] Product management (CRUD)
- [x] Order tracking
- [x] Dashboard with stats

### Phase 3 (Ready for Deployment)
- [x] Docker setup
- [x] Render/Railway configs
- [x] Deployment guide
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Advanced analytics

## Troubleshooting

**Products not loading:**
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Check `backend/data/products.json` exists

**Authentication failing:**
- Ensure JWT_SECRET is set in .env
- Clear browser localStorage and try again
- Check Network tab in DevTools for API errors

**Images not uploading:**
- Ensure `Frontend/images/` folder exists
- Check file permissions
- Verify multer configuration

**CORS errors:**
- Frontend and backend must be on same origin or CORS must be enabled
- Check `backend/src/server.js` CORS settings

## Support

For issues or questions, check:
- Backend logs: `node src/server.js` console output
- Browser console: DevTools F12
- Network tab: Check API responses

## License

MIT - Free to use and modify

---

**Made with ❤️ for affordable resale**
