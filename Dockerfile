# SR Calculator - Production Dockerfile
# Using non-standalone output with npm ci for faster builds

FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
RUN apk add --no-cache libc6-compat openssl

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Use npm ci for faster, more reliable installs
RUN npm ci --legacy-peer-deps --prefer-offline

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
