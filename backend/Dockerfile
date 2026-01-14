FROM node:20-alpine

WORKDIR /app

# Copy package files from backend directory
COPY backend/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy source code
COPY backend/src ./src

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start application
CMD ["node", "src/server.js"]
