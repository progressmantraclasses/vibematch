# ==========================================
# NestJS Backend Production Dockerfile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and package definitions
COPY package.json tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/

# Install dependencies
RUN npm install --workspace=apps/api

# Copy backend source
COPY apps/api/src ./apps/api/src

# Build NestJS
RUN npm run build --workspace=apps/api

# Production runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY apps/api/package.json ./apps/api/

RUN npm install --omit=dev --workspace=apps/api

COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 4000

CMD ["node", "apps/api/dist/main.js"]
