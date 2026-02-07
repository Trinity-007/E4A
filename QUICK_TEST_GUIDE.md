# 🚀 QUICK START & TESTING GUIDE
**E4A Marketplace - Email & Admin Portal Features**

---

## ✅ PRE-FLIGHT CHECKLIST

Before testing, verify:
- [ ] Node.js installed (v22.15.0 ✅)
- [ ] npm installed (10.9.2 ✅)
- [ ] All dependencies installed ✅
- [ ] MongoDB running (or connection string valid)
- [ ] Backend can start without errors ✅
- [ ] .env file configured with MONGODB_URI ✅

---

## 🎯 STEP 1: START THE BACKEND SERVER

```bash
cd backend
npm start
```

Expected output:
```
✅ MongoDB connected
✅ Production backend listening on 3000
```

---

## 🎯 STEP 2: TEST USER SIGNUP (WITH EMAIL)

**URL:** `http://localhost:3000/signup.html`

### Fill the form:
```
Full Name:        Test User
Email:            test@example.com
Phone:            +234 801 234 5678
Gender:           Male/Female/Other
Password:         password123
```

### Expected Results:
1. ✅ Form validates all fields
2. ✅ Email format checked
3. ✅ Password minimum 6 chars enforced
4. ✅ Success message shows email address
5. ✅ Welcome email logged in console (backend terminal):
   ```
   📧 [EMAIL SERVICE] Email would be sent:
   To: test@example.com
   Subject: Welcome to E4A Marketplace!
   Body: [HTML email template...]
   ```
6. ✅ Redirected to marketplace
7. ✅ User is authenticated (token in localStorage)

### To verify email received:
Open browser DevTools → Console → Type:
```javascript
JSON.parse(localStorage.getItem('e4a_user'))
// Should show user data with email
```

---

## 🎯 STEP 3: TEST USER SIGN-IN

**URL:** `http://localhost:3000/signin.html`

### Expected behavior:
1. ✅ Email field is auto-focused
2. ✅ "Remember me" checkbox available
3. ✅ "Forgot password" link visible

### Sign in with:
```
Email:    test@example.com
Password: password123
```

### Expected Results:
1. ✅ Button shows "Signing in..."
2. ✅ Button is disabled during signin
3. ✅ Success message appears
4. ✅ Redirected to marketplace
5. ✅ User is authenticated

### Test "Remember Me":
1. ✅ Check "Keep me signed in"
2. ✅ Sign in
3. ✅ Return to signin.html
4. ✅ Email field pre-filled
5. ✅ Checkbox still checked

---

## 🎯 STEP 4: TEST ADMIN PORTAL

### Step 4A: Create Admin Account
```bash
cd backend
node create_admin.js
```

Expected output:
```
✓ Connected to MongoDB
=== Admin Account Created ===
Email: admin@e4a.com
Password: Admin123456
Role: Super Admin

✓ Setup complete
```

### Step 4B: Access Admin Panel
**URL:** `http://localhost:3000/admin.html`

Should show login form with fields:
- Email input
- Password input
- Login button

### Step 4C: Login with Admin Credentials
```
Email:    admin@e4a.com
Password: Admin123456
```

### Expected Results:
1. ✅ Login button shows "Signing in..."
2. ✅ Button disabled during login
3. ✅ Dashboard loads
4. ✅ Navigation menu visible
5. ✅ "Admin" displayed with Logout button

### Step 4D: Test Dashboard Section
Should show:
- [ ] 4 stat cards (Users, Products, Orders, Verifications)
- [ ] Recent Orders table
- [ ] Recent Users table
- [ ] All data properly formatted

### Step 4E: Test Users Section
Click **Users** in sidebar:
- [ ] Users table loads
- [ ] Shows: Name, Email, Phone, Joined Date
- [ ] Delete buttons visible and functional
- [ ] Empty state if no users

### Step 4F: Test Orders Section
Click **Orders** in sidebar:
- [ ] Orders table loads
- [ ] Shows: Order ID, User, Total, Status, Date
- [ ] Update status button works
- [ ] Status displayed with badge styling

### Step 4G: Test Products Section
Click **Products** in sidebar:
- [ ] Products table loads
- [ ] Shows: Name, Category, Price, Created Date
- [ ] Delete buttons functional
- [ ] Prices formatted with ₦ symbol

### Step 4H: Test Verifications Section
Click **Verifications** in sidebar:
- [ ] Pending verifications display
- [ ] Shows: User, Type, Status, Date
- [ ] Approve/Reject buttons available
- [ ] Functional and responsive

### Step 4I: Test Responsiveness
Resize browser to test:
- [ ] Desktop (1200px+): Full layout with sidebar
- [ ] Tablet (768px-1199px): Adjusted layout
- [ ] Mobile (< 768px): Stacked layout, smaller sidebar
- [ ] All elements visible and functional

---

## 🧪 TEST ERROR HANDLING

### Signup Error Tests:
1. **Missing Fields**: Try submitting with empty fields
   - Expected: "All fields are required"

2. **Invalid Email**: Try `notanemail`
   - Expected: "Please enter a valid email address"

3. **Short Password**: Try password with 5 chars
   - Expected: "Password must be at least 6 characters"

4. **Duplicate Email**: Try same email from first signup
   - Expected: "Email already registered"

### Login Error Tests:
1. **Wrong Email**: Try non-existent email
   - Expected: "Invalid credentials"

2. **Wrong Password**: Try correct email, wrong password
   - Expected: "Invalid credentials"

3. **Missing Fields**: Try empty fields
   - Expected: "Email and password are required"

### Admin Error Tests:
1. **Wrong Credentials**: Try invalid admin email/password
   - Expected: "Invalid credentials"

2. **Network Error**: Disable internet briefly (optional)
   - Expected: "Network error. Try again."

---

## 🔍 VERIFY CONSOLE LOGS

### Backend Console (terminal):
Look for these logs during signup:
```
[auth/register] payload: { name: 'Test User', email: 'tes***', phone: '+234 801 234 5678', gender: 'Male' }
[auth/register] created user id= [long_id]
📧 [EMAIL SERVICE] Email would be sent:
To: test@example.com
Subject: 🎉 Welcome to E4A Marketplace!
```

### Browser Console (F12):
Look for API calls:
```
🔐 Signing up...
📡 Response status: 200
📦 Response data: { success: true, user: {...}, token: '...' }
```

---

## 📊 FEATURE CHECKLIST

### ✅ Email System
- [x] Email service module created
- [x] Welcome email template configured
- [x] Integration with signup endpoint
- [x] Console fallback for development
- [x] No blocking of signup if email fails
- [x] Professional HTML templates

### ✅ Authentication
- [x] User registration with email
- [x] User login with credentials
- [x] Admin login separate system
- [x] JWT token issued (7-day expiry)
- [x] Password hashing with bcrypt
- [x] Email validation

### ✅ Signup Form
- [x] Enhanced UI with labels
- [x] Email info box displayed
- [x] All field validation
- [x] Success message with email
- [x] Error handling
- [x] Loading state feedback

### ✅ Sign-In Form
- [x] Email auto-focus
- [x] Remember email feature
- [x] Forgot password modal
- [x] Email & password validation
- [x] Loading state feedback
- [x] Error messages

### ✅ Admin Portal
- [x] Login page
- [x] Dashboard with stats
- [x] Users management
- [x] Orders management
- [x] Products management
- [x] Verifications management
- [x] Responsive design
- [x] Professional styling
- [x] All visibility fixed

### ✅ Security
- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Input validation
- [x] CORS configured
- [x] Environment variables
- [x] Token expiration

---

## 🐛 TROUBLESHOOTING

### "MongoDB connection error"
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- Ensure database exists

### "Cannot find module 'nodemailer'"
```bash
cd backend
npm install
```

### "Admin account already exists"
- This is normal on second run
- Account is already created, you can login

### Email not showing in console
- Might be buffered, wait a moment
- Check backend terminal, not browser console
- Restart server if needed

### Admin portal shows blank/empty
- Check browser console for errors
- Verify admin route returns data
- Make sure admin is authenticated

### "Email already registered"
- Try different email address
- Or check exact email used before

---

## 📞 QUICK REFERENCE

### Admin Credentials
```
Email:    admin@e4a.com
Password: Admin123456
```

### API Endpoints
```
POST /api/auth/register    - User signup
POST /api/auth/login       - User login
POST /api/admin/login      - Admin login
GET  /api/admin/dashboard  - Dashboard data
GET  /api/admin/users      - List users
GET  /api/admin/orders     - List orders
GET  /api/admin/products   - List products
GET  /api/admin/verifications - Pending verifications
```

### Port
```
Backend: 3000
Frontend: Served from backend static files
```

### Database
```
MongoDB: localhost:27017/e4a_db
Admin user: admin@e4a.com
Test user: test@example.com (from signup test)
```

---

## ✨ FINAL VERIFICATION

Before declaring success, confirm:

- [ ] Signup works with email notification
- [ ] Sign-in works with credentials
- [ ] Admin portal loads and displays data
- [ ] All sections of admin portal functional
- [ ] Forms validate input properly
- [ ] Error messages are clear
- [ ] App is responsive on mobile
- [ ] No JavaScript errors in console
- [ ] Layout is balanced (nothing cut off)
- [ ] Buttons are clickable
- [ ] Redirect works after actions
- [ ] localStorage stores tokens
- [ ] Session persists on reload

---

## 🎉 SUCCESS!

If all tests pass:
✅ **SYSTEM IS FULLY OPERATIONAL**
✅ **READY FOR PRODUCTION**
✅ **ALL FEATURES WORKING PERFECTLY**

---

**Need help?** Check TEST_REPORT.md for detailed documentation.
