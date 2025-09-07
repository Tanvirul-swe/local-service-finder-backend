# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies, including dev
RUN npm install

COPY . .

# Build the project (e.g., compile TypeScript)
RUN npm run build


# --- Stage 2: Production (slim) ---
FROM node:18-alpine AS production

WORKDIR /app

# Only copy production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]
