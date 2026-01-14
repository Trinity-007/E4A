# Render Deployment - Configuration Instructions

## Important: Use Render Web UI, NOT render.yaml

Due to Render's behavior with `render.yaml`, we'll use the web interface instead.

## Steps to Deploy on Render

### 1. Go to Render Dashboard
https://render.com

### 2. Create New Web Service
- Click "New +" 
- Click "Web Service"
- Select **E4A** repository from GitHub
- Click "Connect"

### 3. Configure Service (IMPORTANT - Follow Exactly)

**Name:** `e4a-backend`

**Environment:** `Node`

**Build Command:**
```
npm install --prefix backend
```

**Start Command:**
```
node backend/src/server.js
```

**Instance Type:** `Free` (or Starter if you want it to stay awake)

### 4. Set Environment Variables (CRITICAL)

Click "Advanced" → "Environment Variables"

Add these three variables:

1. **MONGODB_URI**
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/e4a_db`
   - (Get from MongoDB Atlas)

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: `your_strong_secret_key_min_32_characters_long`

3. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

### 5. Deploy
Click **"Deploy"**

Wait 2-3 minutes for deployment to complete.

### 6. Get Backend URL
Once deployed (green checkmark ✅), you'll see the URL at the top:
```
https://e4a-backend-xxxxx.onrender.com
```

This is your backend!

---

## Troubleshooting

### "Package.json not found in /opt/render/project/src"
- ✅ FIXED - We removed render.yaml and you're using the UI
- The UI will correctly use the build/start commands above

### "yarn: command not found"
- ✅ FIXED - Using `npm` commands now instead of yarn

### Build still fails
Tell me the exact error and we'll fix it!

---

## Important Notes

- ✅ `render.yaml` has been removed (it was causing issues)
- ✅ Using Render Web UI configuration (more reliable)
- ✅ Backend root directory is properly set
- ✅ Package.json is in the `backend` folder

---

**Follow the Web UI steps above - don't create any configuration files!**
