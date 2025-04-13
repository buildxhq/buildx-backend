# ✅ Use official Node.js image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy rest of the application
COPY . .

# ✅ Prisma: Generate client before building
RUN npx prisma generate

# ✅ Build Next.js (with App Router)
RUN npm run build

# ✅ Production image
FROM node:18-alpine AS production

WORKDIR /app

# Only copy what's needed in final image
COPY --from=base /app ./

# ✅ Install only production deps
RUN npm ci --omit=dev

EXPOSE 3000

# ✅ Start server
CMD ["npm", "start"]

