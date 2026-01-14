# 🚀 E4A Deployment Testing Guide

## ✅ System Status

| Component | Status | Details |
|-----------|--------|---------|
| **MongoDB** | ✅ Running | Listening on localhost:27017 |
| **Node.js Backend** | ✅ Running | Server on localhost:3000 |
| **Netlify Frontend** | ✅ Deployed | Live on Netlify URL |
| **Database Connection** | ✅ Active | Connected and ready |

---

## 🌐 Deployment Links

### Frontend (Netlify)
**Your deployed site URL:** Check your Netlify dashboard for the link
- Direct to deployed site (can share with friends)
- All frontend pages live and ready

### Backend (Local)
**API Server:** http://localhost:3000 (for local testing)
- All endpoints available
- Connected to MongoDB

---

## 🧪 Testing Checklist

### ✅ Authentication Tests

#### 1. **Sign Up Test**
```
1. Visit your Netlify URL
2. Click "Sign Up"
3. Fill in:
   - Name: Your name
   - Email: your@email.com
   - Password: testpass123
4. Click "Sign Up"
5. Expected: Success message → Redirect to home
6. Check: User appears in MongoDB
```

**What happens:**
- User data encrypted with bcrypt
- JWT token generated
- Token stored in browser localStorage
- User object saved to e4a_user

---

#### 2. **Sign In Test**
```
1. Click "Sign In"
2. Enter email and password from signup
3. Click "Sign In"
4. Expected: Logged in → "My Account" appears in navbar
5. Verify: Can see user name in account page
```

**What gets saved:**
- JWT token (7-day expiry)
- User profile in localStorage

---

### 🛍️ Shopping Tests

#### 3. **Browse Products**
```
1. Click "Shop" in navbar
2. View products
3. Search for a product
4. Click on a product to view details
5. Expected: Product details load with image, price, description
```

**Data loaded from:**
- Products seeded to MongoDB from `/backend/data/products.json`
- Shows all 30+ products

---

#### 4. **Add to Cart**
```
1. Browse products
2. Click "Add to Cart" on a product
3. Cart count in navbar increases
4. Go to Cart page
5. Expected: Item appears in cart with price and quantity
```

**Stored in:**
- Browser localStorage (e4a_cart)
- Persists across page refreshes

---

#### 5. **Make an Offer (Negotiation)**
```
1. On a product, click "Offer" button
2. Enter a lower price (e.g., product is ₦100, offer ₦80)
3. Expected: Success → Redirect to negotiations.html
4. View your offer with message history
```

**Data saved to:**
- MongoDB (Negotiation collection)
- Shows productId, buyerId, offer price, messages

---

#### 6. **Checkout**
```
1. Add products to cart
2. Click "Checkout"
3. Fill in delivery form:
   - Full name
   - Email
   - Phone: +234...
   - Street address
   - City, State, Postal code
4. Select delivery method (Standard ₦500, Express, etc.)
5. Select payment method
6. Check Terms & Conditions
7. Click "Complete Order"
8. Expected: Success message → Redirects to home
```

**What gets saved:**
- Order with full delivery details
- Delivery method selected
- Payment method selected
- Total with tax (5%) and delivery fee
- Timestamp and status

---

#### 7. **View Account**
```
1. Click "My Account" in navbar (only shows when logged in)
2. See dashboard with:
   - User profile
   - Statistics (Orders, Reviews, Wishlist)
3. Check tabs:
   - My Orders: Shows orders you placed
   - Inbox: Messages (placeholder)
   - Pending Reviews: Products to review
   - Wishlist: Saved items
   - Recently Viewed: Items you looked at
   - Vouchers: Discount codes (WELCOME10, SAVE20, LUCKY50)
   - Settings: Edit profile, addresses, payment method
```

**All data synced with:**
- MongoDB for orders
- localStorage for wishlist and recently viewed

---

#### 8. **Request Verification**
```
1. Go to verifications.html
2. Click "Request Verification"
3. Select verification type (Identity, Phone, Address, Business)
4. Upload document
5. Submit
6. Expected: Status shows "pending"
```

**Saved to:**
- MongoDB (Verification collection)
- Admin can approve/reject (future feature)

---

#### 9. **Seller API**
```
1. Go to seller-api.html
2. Click "Generate API Key"
3. Copy and save the key
4. Click "Test Connection"
5. Expected: Shows your products
```

**Testing:**
- API key stored in MongoDB
- Can test with curl or Postman

---

### 👤 User Account Tests

#### 10. **Edit Profile**
```
1. Go to My Account → Settings
2. Edit:
   - Full name
   - Phone number
3. Click "Save Profile"
4. Expected: Success message, data persists
```

**Saved to:**
- localStorage (e4a_user)

---

#### 11. **Manage Addresses**
```
1. Go to My Account → Settings → Address Book
2. Click "Add New Address"
3. Fill in:
   - Full name
   - Phone
   - Street, City, State, Postal, Country
4. Click "Save Address"
5. Expected: Address card appears
6. Test: Edit and Delete buttons
```

**Saved to:**
- localStorage (e4a_addresses)

---

#### 12. **Logout**
```
1. Go to My Account → Settings
2. Scroll to bottom
3. Click "Logout" button
4. Confirm dialog
5. Expected: Logged out, redirected to home
6. "Sign In" button appears in navbar
```

**Clears:**
- e4a_token
- e4a_user
- Session data

---

## 📊 Testing with Multiple Users

### Share with Friends
1. **Send them your Netlify URL**
2. **Each person:**
   - Creates their own account (different email)
   - Can browse and shop
   - Can place orders
   - Each user's data is separate

### Test Negotiations Between Users
1. **User 1:** Browse product, click "Offer", make offer
2. **User 2:** (If you're seller) View negotiation, counter-offer
3. Check message history in negotiations.html

---

## 🔧 API Endpoints Active

All these endpoints are live and connected to MongoDB:

### Authentication
```
POST /api/auth/register - Create account
POST /api/auth/login - Sign in
```

### Products
```
GET /api/products - Get all products
GET /api/products/:id - Get single product
```

### Orders
```
POST /api/orders - Create order (saved to MongoDB)
GET /api/orders - View orders
```

### Negotiations
```
POST /api/negotiations - Make offer
GET /api/negotiations/user/:userId - View your negotiations
GET /api/negotiations/:id - View single negotiation
POST /api/negotiations/:id/message - Send counter-offer
```

### Verifications
```
POST /api/verifications - Request verification
GET /api/verifications/user/:userId - Check status
```

### Seller API
```
POST /api/seller/keys - Generate API key
GET /api/seller/products - Get your products (with API key)
```

---

## 💾 Database Collections

All data stored in MongoDB:

| Collection | Contains | Status |
|-----------|----------|--------|
| users | Account info, hashed passwords | ✅ Working |
| products | All products (30+) | ✅ Seeded |
| orders | Customer orders with delivery details | ✅ Saving |
| negotiations | Price offer messages | ✅ Saving |
| verifications | Identity verification requests | ✅ Saving |
| apikeys | Seller API credentials | ✅ Working |

---

## ⚠️ Known Limitations (Can Fix Later)

1. **Email confirmations** - SMTP not configured (orders don't send emails yet)
2. **Payment gateway** - Not integrated (Stripe/Flutterwave)
3. **Admin panel** - Not created yet (can't approve verifications)
4. **Image uploads** - Basic support (can improve)
5. **Real-time notifications** - Not implemented yet

---

## 🐛 Issues Found During Testing?

If something breaks:

1. **Check backend logs** - Terminal will show errors
2. **Check browser console** - F12 → Console tab
3. **Verify MongoDB** - Should show "MongoDB connected" on startup
4. **Check API response** - Use browser DevTools Network tab

---

## 📞 Quick Troubleshooting

### "Can't sign up"
✅ Check MongoDB is running
✅ Check backend shows "MongoDB connected"
✅ Check browser console for errors

### "Orders not saving"
✅ Verify backend running on port 3000
✅ Verify MongoDB is running
✅ Check backend console for error messages

### "Offer shows JSON error"
✅ User._id must be saved from auth (should be fixed now)
✅ Check backend logs for negotiation route

### "Cart empty after refresh"
✅ Check if localStorage is enabled
✅ F12 → Application → Local Storage → Look for e4a_cart

---

## 🎯 Success Criteria

You'll know everything is working when you can:

- ✅ Sign up with new account
- ✅ Sign in with email/password
- ✅ Browse and search products
- ✅ Add items to cart
- ✅ Checkout with delivery address
- ✅ View your orders
- ✅ Make an offer on a product
- ✅ View negotiations
- ✅ Edit your profile
- ✅ Manage saved addresses
- ✅ Logout and sign back in

---

## 📈 Next Steps After Testing

1. Fix any bugs that show up
2. Configure SMTP for order confirmation emails
3. Integrate payment gateway (Stripe)
4. Create admin panel for verification approval
5. Add real-time notifications
6. Implement seller dashboard
7. Add review/rating system
8. Mobile app version

---

**🚀 Ready to test! Your backend and MongoDB are running.**

**Share your Netlify link with friends and test together!**
