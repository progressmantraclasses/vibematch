# ==========================================
# Next.js Frontend Production Dockerfile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package definitions
COPY package.json tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/tailwind.config.ts ./apps/web/
COPY apps/web/postcss.config.js ./apps/web/
COPY apps/web/next.config.js ./apps/web/

# Install dependencies
RUN npm install --workspace=apps/web

# Copy frontend source
COPY apps/web/src ./apps/web/src

# Set build environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js
RUN npm run build --workspace=apps/web

# Production runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY apps/web/package.json ./apps/web/

RUN npm install --omit=dev --workspace=apps/web

COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public 2>/dev/null || true
COPY --from=builder /app/apps/web/next.config.js ./apps/web/

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web"]
