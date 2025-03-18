
✅ **Now the backend has clear documentation.**  

---

## **✅ `Dockerfile` (For Containerization & Deployment)**
This **makes deployment easy** on Railway/AWS.

```dockerfile
# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]

