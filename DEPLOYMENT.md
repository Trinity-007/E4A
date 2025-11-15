# Deployment Guide for E4A Backend

This guide covers deploying the E4A backend to production platforms.

## Option 1: Render.com (Recommended)

### Steps:
1. Sign up at https://render.com
2. Create a new Web Service
3. Connect your GitHub repo (or use Docker image)
4. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/e4a_db
   JWT_SECRET=your_strong_secret_key_here
   PORT=10000
   ```
5. Deploy using Dockerfile (automatically detected)
6. Frontend can be served from `/Frontend` static files

### Cost: Free tier available

---

## Option 2: Railway.app

### Steps:
1. Sign up at https://railway.app
2. Create new project → Deploy from GitHub
3. Add MongoDB service from Railway marketplace
4. Set environment variables (same as above)
5. Railway automatically detects `package.json` and deploys

### Cost: $5/month starting tier

---

## Option 3: Heroku (Legacy - paid)

### Steps:
```bash
heroku login
heroku create e4a-backend
heroku config:set MONGODB_URI=<your-mongodb-url>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

---

## Option 4: Docker + Self-Hosted (DigitalOcean, AWS)

### Run locally with Docker Compose:
```bash
cd backend
docker-compose up --build
```

### Deploy to cloud:
1. Push Docker image to registry (Docker Hub, ECR)
2. Deploy on DigitalOcean App Platform, AWS ECS, or similar
3. Attach MongoDB Atlas or managed MongoDB service

---

## Production Checklist

- [ ] Use strong JWT_SECRET (min 32 chars)
- [ ] Enable HTTPS/SSL
- [ ] Set CORS properly (restrict to your domain)
- [ ] Use managed MongoDB (MongoDB Atlas) instead of local
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging
- [ ] Backup database regularly
- [ ] Update Node.js dependencies regularly

---

## Frontend Deployment

Option A: Serve from backend (current setup)
- Frontend files in `Frontend/` are served by Node.js on `/`

Option B: Deploy to CDN (Vercel, Netlify)
- Update `API_BASE` in `script.js` to point to backend
- Deploy `Frontend/` folder separately

---

## Testing Production Setup

```bash
# Test backend API
curl https://your-backend-url.com/api/products

# Test auth
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting

**Products not loading:**
- Check MongoDB connection string
- Verify `data/products.json` exists and is valid

**Auth failing:**
- Check JWT_SECRET is set
- Verify MongoDB is accessible

**CORS errors:**
- Add your frontend domain to backend CORS settings
- Update `app.use(cors())` with options if needed

---

## Next Steps

1. Get MongoDB Atlas free account (https://mongodb.com/cloud)
2. Create a Render or Railway account
3. Deploy backend
4. Update frontend API_BASE if different from localhost:3000
5. Deploy frontend (can be served from backend or separate CDN)

