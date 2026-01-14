# ⚡ Railway Build Failure - Quick Fixes

## Common Issues & Solutions

### 1. **Build Command Failing**
```
Error: npm install failed
```
**Fix:**
- Check `backend/package.json` exists
- All package names correct?
- No circular dependencies?
- Try: `npm install` locally first

### 2. **Node Modules Not Found**
```
Error: Cannot find module 'express'
```
**Fix:**
- Ensure `backend/package.json` has all dependencies
- Run locally: `npm install` in backend folder
- Commit `package.json` to GitHub
- Push to trigger Railway rebuild

### 3. **Dockerfile Issues**
```
Error: COPY failed: file not found
```
**Fix:**
- I updated `Dockerfile` context
- Should now work correctly
- Push changes: `git push origin master`
- Trigger rebuild in Railway

### 4. **Port Binding Error**
```
Error: listen EADDRINUSE :::3000
```
**Fix:**
- Backend code must read `PORT` env var:
  ```javascript
  const PORT = process.env.PORT || 3000;
  ```
- Current code already has this ✅

### 5. **MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:**
- ❌ Can't use localhost on Railway
- ✅ Use MongoDB Atlas (free cloud DB)
- Set `MONGODB_URI` env var in Railway settings

---

## Step-by-Step Fix

### 1. Push Latest Code
```powershell
cd C:\Users\tosin.aladesae\Desktop\E4A_full_website
git add .
git commit -m "Fix: Railway deployment"
git push origin master
```

### 2. Go to Railway Dashboard
https://railway.app

### 3. Delete Old Deployment (if exists)
1. Click your project
2. Click on the service
3. Settings → Delete

### 4. Redeploy
1. Click "New" → "GitHub Repo"
2. Select E4A
3. Wait for build

### 5. Set Environment Variables
Click on service → Variables tab
```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/e4a_db
JWT_SECRET = your_strong_secret_key_min_32_characters
NODE_ENV = production
```

### 6. Check Build Logs
1. Deployments tab
2. Click latest build
3. View Build Logs
4. Look for errors

---

## MongoDB Atlas Setup (3 minutes)

If build fails with MongoDB connection error:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/e4a_db`
5. Set in Railway as `MONGODB_URI`

---

## Still Failing?

Check Railway build logs and tell me:
1. What's the exact error message?
2. Which step is failing? (Building, Installing, Starting)
3. Any error codes?

I'll fix it!

---

**All deployment files are updated and pushed. Try deploying again!** 🚀
