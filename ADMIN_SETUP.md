# 🔐 Admin Panel Setup Guide

## Overview
The admin panel is now fully functional for managing the E4A marketplace. Complete backend infrastructure with authentication, and a professional frontend dashboard.

## Admin Login Credentials

**Email:** `admin@e4a.com`  
**Password:** `Admin123456`  
**Role:** Super Admin (all permissions)

## Accessing the Admin Panel

1. **Locally:** Open `Frontend/admin.html` in your browser or navigate to the admin page
2. **Production (Render):** Will be available at `https://your-render-url.onrender.com/admin.html` once deployed

## Admin Features

### 📈 Dashboard
- **Real-time Statistics:**
  - Total users count
  - Total products count
  - Total orders count
  - Pending verifications count

- **Recent Activity:**
  - Last 5 orders with status
  - Last 5 new users

### 👥 User Management
- View all registered users (paginated, 20 per page)
- Delete user accounts
- Search and filter users by registration date

### 📦 Order Management
- View all marketplace orders (paginated)
- See order details: ID, customer, total amount, status, date
- Update order status: pending → processing → shipped → delivered
- Track order fulfillment progress

### 🏪 Product Management
- View all products in the marketplace
- Delete products (moderates product listings)
- Filter products by category

### ✅ Verification Management
- Review pending user verification requests
- Approve verification requests (status: approved)
- Reject verification with custom rejection reason
- View verification history with status tracking

## Backend API Endpoints

All admin endpoints require JWT authentication token.

### Authentication
- **POST** `/api/admin/login` - Admin login with email/password

### Dashboard
- **GET** `/api/admin/dashboard` - Get statistics and recent data

### Users
- **GET** `/api/admin/users?page=1` - List users (paginated)
- **DELETE** `/api/admin/users/:userId` - Remove user

### Orders
- **GET** `/api/admin/orders?page=1` - List orders (paginated)
- **PUT** `/api/admin/orders/:orderId` - Update order status

### Products
- **GET** `/api/admin/products?page=1` - List products (paginated)
- **DELETE** `/api/admin/products/:productId` - Remove product

### Verifications
- **GET** `/api/admin/verifications?status=pending` - Get verifications by status
- **POST** `/api/admin/verifications/:id/approve` - Approve verification
- **POST** `/api/admin/verifications/:id/reject` - Reject with reason

## File Structure

```
Backend Admin Files:
├── src/models/Admin.js           (Admin user model with roles/permissions)
├── src/routes/admin.js           (All admin API endpoints)
├── create_admin.js               (Initialize admin account)
└── src/server.js                 (Updated with admin routes)

Frontend Admin Files:
└── Frontend/admin.html           (Complete admin dashboard UI)
```

## Backend Admin Model

```javascript
{
  email: "admin@e4a.com",
  password: "hashed_password",
  name: "Admin User",
  role: "super_admin",  // or "admin"
  permissions: [
    "manage_users",
    "manage_products",
    "manage_orders",
    "approve_verifications",
    "manage_admins"
  ],
  createdAt: timestamp,
  lastLogin: timestamp
}
```

## Security Features

✅ **JWT Authentication**
- 7-day token expiration
- Secure password hashing with bcrypt
- Token stored in browser localStorage

✅ **Role-Based Access Control**
- Super Admin role with all permissions
- Admin role with limited permissions
- Permission array for fine-grained control

✅ **Protected Routes**
- All admin endpoints protected by `verifyAdmin` middleware
- JWT token validation on every request
- Admin existence verification

## Testing the Admin Panel

### Step 1: Login
1. Go to `Frontend/admin.html`
2. Enter email: `admin@e4a.com`
3. Enter password: `Admin123456`
4. Click "Login"

### Step 2: Dashboard
- View statistics card showing total users, products, orders, pending verifications
- See recent orders and users

### Step 3: Manage Users
- Click "👥 Users" in sidebar
- View all registered users
- Click "Delete" to remove a user account

### Step 4: Manage Orders
- Click "📦 Orders" in sidebar
- View all marketplace orders
- Click "Update" to change order status

### Step 5: Manage Products
- Click "🏪 Products" in sidebar
- View all products
- Click "Delete" to remove a product

### Step 6: Verify Users
- Click "✅ Verifications" in sidebar
- Review pending verification requests
- Click "Approve" or "Reject" with reason

## Deployment to Render

1. Push all admin changes to GitHub:
   ```bash
   git add .
   git commit -m "Add complete admin panel"
   git push
   ```

2. Render automatically deploys when you push
3. Admin panel will be live at your Render URL

## Troubleshooting

**"Cannot connect to admin API"**
- Make sure backend is running on port 3000
- Check API_BASE URL in admin.html matches your backend
- Verify CORS is enabled for admin routes

**"Login failed" after entering credentials**
- Ensure create_admin.js was executed successfully
- Check MongoDB connection is active
- Verify admin@e4a.com exists in MongoDB

**"Network error" message**
- Check backend server is running
- Verify MongoDB connection
- Check browser console for detailed error

## Next Steps

1. **Deploy to Production:** Push to GitHub → Render deploys automatically
2. **Add More Admins:** Create additional admin accounts (requires code update)
3. **Expand Features:** Add admin logs, analytics, reporting, etc.
4. **Security Hardening:** Add 2FA, IP whitelisting, rate limiting for admin login

## Additional Admin Accounts

To create additional admin accounts, modify `create_admin.js` and run it again with different credentials, or create a new admin creation endpoint.

Example:
```javascript
// Add to backend/create_admin.js
const adminAccounts = [
  { email: 'admin@e4a.com', password: 'Admin123456', name: 'Super Admin' },
  { email: 'moderator@e4a.com', password: 'Mod123456', name: 'Moderator' }
];
```

## Support

For issues or questions about the admin panel:
1. Check backend logs for errors
2. Review MongoDB collections for data issues
3. Test API endpoints with Postman/curl
4. Check browser developer console for frontend errors

---

**Admin Panel Status:** ✅ FULLY OPERATIONAL

Last Updated: 2024
Admin System Version: 1.0
